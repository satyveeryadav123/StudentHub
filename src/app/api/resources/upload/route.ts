import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "NOTES_PDF",
  "SYLLABUS",
  "IMPORTANT_QUESTION",
  "PYQ",
  "RESUME_TEMPLATE",
  "PLACEMENT",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to contribute resources." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    let type = (formData.get("type") as string | null)?.trim()?.toUpperCase() || "NOTES_PDF";
    const rawSemester = formData.get("semester") as string | null;
    const subjectSlug = (
      (formData.get("subjectSlug") as string | null) ||
      (formData.get("subject") as string | null)
    )?.trim();
    const rawUnit = (
      (formData.get("unitNumber") as string | null) ||
      (formData.get("unit") as string | null)
    )?.trim();
    const rawYear = formData.get("year") as string | null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing required fields: file and title are mandatory." },
        { status: 400 }
      );
    }

    // Map PYQ_PDF to PYQ for database enum alignment
    if (type === "PYQ_PDF") {
      type = "PYQ";
    }

    if (!ALLOWED_TYPES.includes(type)) {
      type = "NOTES_PDF";
    }

    // Parse semester number (e.g. "sem-3" -> 3 or "3" -> 3)
    let semester: number | null = null;
    if (rawSemester) {
      const match = rawSemester.match(/\d+/);
      if (match) {
        semester = parseInt(match[0], 10);
      }
    }

    // Parse unit number
    let unitNumber: number | null = null;
    if (rawUnit) {
      const parsedUnit = parseInt(rawUnit, 10);
      if (!isNaN(parsedUnit)) {
        unitNumber = parsedUnit;
      }
    }

    // Parse year (e.g. "2024-25" -> 2024 or "2024" -> 2024)
    let year: number | null = null;
    if (rawYear) {
      const yearMatch = rawYear.match(/\d{4}/);
      if (yearMatch) {
        year = parseInt(yearMatch[0], 10);
      }
    }

    // Validate file size (max 10MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    // Validate file extension & mime type
    const fileExt = file.name.split(".").pop()?.toLowerCase();
    if (fileExt !== "pdf" && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only valid PDF files are permitted." },
        { status: 400 }
      );
    }

    // Safe sanitized filename
    const timestamp = Date.now();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${user.id}/${timestamp}_${cleanFileName}`;

    const adminClient = createAdminClient();

    // Check user role from profiles table
    const { data: userProfile } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isUserAdmin =
      userProfile?.role === "admin" || userProfile?.role?.toLowerCase() === "admin";
    const initialStatus = isUserAdmin ? "APPROVED" : "PENDING";

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to 'resources' bucket
    const { error: uploadError } = await adminClient.storage
      .from("resources")
      .upload(filePath, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: `Storage upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    let publicUrl = "";

    // If admin uploaded, copy to public 'approved-resources' bucket for instant access
    if (isUserAdmin) {
      try {
        const { error: copyError } = await adminClient.storage
          .from("resources")
          .copy(filePath, filePath, {
            destinationBucket: "approved-resources",
          });

        if (!copyError) {
          const { data: pubData } = adminClient.storage
            .from("approved-resources")
            .getPublicUrl(filePath);
          publicUrl = pubData.publicUrl;
        } else {
          // Fallback: upload directly to approved-resources
          await adminClient.storage
            .from("approved-resources")
            .upload(filePath, buffer, {
              contentType: "application/pdf",
              upsert: true,
            });
          const { data: pubData } = adminClient.storage
            .from("approved-resources")
            .getPublicUrl(filePath);
          publicUrl = pubData.publicUrl;
        }
      } catch (copyErr) {
        console.error("Error auto-publishing admin upload:", copyErr);
      }
    }

    // Insert row into 'resources' table
    const { data: resourceData, error: insertError } = await adminClient
      .from("resources")
      .insert({
        title,
        type,
        semester,
        subject_slug: subjectSlug || null,
        unit_number: unitNumber,
        year,
        file_url: publicUrl,
        file_path: filePath,
        uploaded_by: user.id,
        status: initialStatus,
        ...(isUserAdmin
          ? {
              approved_by: user.id,
              approved_at: new Date().toISOString(),
            }
          : {}),
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      // Clean up uploaded file if database insert fails
      await adminClient.storage.from("resources").remove([filePath]);
      return NextResponse.json(
        { error: `Failed to save resource record: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resourceId: resourceData.id,
      status: initialStatus,
      message: isUserAdmin
        ? "Upload successful. Published and instantly live!"
        : "Upload successful. Pending admin approval.",
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during resource upload." },
      { status: 500 }
    );
  }
}
