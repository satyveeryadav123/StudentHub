import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Please sign in." },
        { status: 401 }
      );
    }

    const adminClient = createAdminClient();

    // Verify caller is admin using profiles table check
    const { data: callerProfile, error: profileErr } = await adminClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileErr || callerProfile?.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { resourceId, action, rejectionReason } = body;

    if (!resourceId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: resourceId and action are required." },
        { status: 400 }
      );
    }

    const normalizedAction = action.toUpperCase();
    if (normalizedAction !== "APPROVE" && normalizedAction !== "REJECT") {
      return NextResponse.json(
        { error: "Invalid action. Must be 'APPROVE' or 'REJECT'." },
        { status: 400 }
      );
    }

    // 1. Get the resource row
    const { data: resource, error: getErr } = await adminClient
      .from("resources")
      .select("*")
      .eq("id", resourceId)
      .single();

    if (getErr || !resource) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 }
      );
    }

    // Helper to send email notification to uploader via Resend
    const sendNotificationEmail = async (actionType: "APPROVE" | "REJECT") => {
      try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey || resendApiKey === "re_your_key_here") {
          console.log("[Email Notification] RESEND_API_KEY is not configured. Skipping email notification.");
          return;
        }

        // Fetch uploader email from Supabase Auth admin or profiles
        let uploaderEmail: string | null = null;
        if (resource.uploaded_by) {
          try {
            const { data: userData } = await adminClient.auth.admin.getUserById(resource.uploaded_by);
            if (userData?.user?.email) {
              uploaderEmail = userData.user.email;
            }
          } catch (err) {
            console.error("[Email Notification] Error fetching auth user:", err);
          }

          if (!uploaderEmail) {
            try {
              const { data: prof } = await adminClient
                .from("profiles")
                .select("email")
                .eq("id", resource.uploaded_by)
                .single();
              if (prof?.email) {
                uploaderEmail = prof.email;
              }
            } catch {
              // Ignore
            }
          }
        }

        if (!uploaderEmail) {
          console.log("[Email Notification] No uploader email found. Skipping email.");
          return;
        }

        const resend = new Resend(resendApiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "StudentHub <noreply@studenthub.in>";

        if (actionType === "APPROVE") {
          await resend.emails.send({
            from: fromEmail,
            to: uploaderEmail,
            subject: "✅ Your notes have been approved — StudentHub",
            html: `
              <h2>Great news! Your submission was approved.</h2>
              <p>Your uploaded resource <strong>${resource.title}</strong> has been approved and is now visible to all students.</p>
              <p>Thank you for contributing to StudentHub!</p>
              <br>
              <a href="https://studentshub.vercel.app/notes">
                View on StudentHub →
              </a>
            `,
          });
          console.log(`[Email Notification] Approval email sent to ${uploaderEmail}`);
        } else {
          const reason = rejectionReason || "Rejected by moderator";
          await resend.emails.send({
            from: fromEmail,
            to: uploaderEmail,
            subject: "❌ Your submission needs revision — StudentHub",
            html: `
              <h2>Your submission needs revision.</h2>
              <p>Your uploaded resource <strong>${resource.title}</strong> was not approved.</p>
              <p><strong>Reason:</strong> ${reason}</p>
              <p>You can upload an improved version anytime from your dashboard.</p>
              <br>
              <a href="https://studentshub.vercel.app/dashboard/upload">
                Upload Again →
              </a>
            `,
          });
          console.log(`[Email Notification] Rejection email sent to ${uploaderEmail}`);
        }
      } catch (emailErr) {
        console.error("[Email Notification Error]:", emailErr);
        // Email failure must not block the approve/reject flow
      }
    };

    if (normalizedAction === "APPROVE") {
      const sourceFilePath = resource.file_path;
      const destinationFilePath = sourceFilePath;

      // Copy file from 'resources' bucket to 'approved-resources' bucket
      // Try direct copy, fallback to download & upload
      const { error: copyError } = await adminClient.storage
        .from("resources")
        .copy(sourceFilePath, destinationFilePath, {
          destinationBucket: "approved-resources",
        });

      if (copyError) {
        // Fallback: download from private resources and upload to public approved-resources
        const { data: fileBlob, error: downloadError } = await adminClient.storage
          .from("resources")
          .download(sourceFilePath);

        if (downloadError || !fileBlob) {
          return NextResponse.json(
            { error: `Failed to download resource file: ${downloadError?.message || "File missing"}` },
            { status: 500 }
          );
        }

        const arrayBuffer = await fileBlob.arrayBuffer();
        const { error: uploadError } = await adminClient.storage
          .from("approved-resources")
          .upload(destinationFilePath, Buffer.from(arrayBuffer), {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          return NextResponse.json(
            { error: `Failed to copy file to approved storage: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }

      // 3. Get public URL of copied file
      const {
        data: { publicUrl },
      } = adminClient.storage
        .from("approved-resources")
        .getPublicUrl(destinationFilePath);

      // 4. Update resources row
      const { error: updateError } = await adminClient
        .from("resources")
        .update({
          status: "APPROVED",
          file_url: publicUrl,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", resourceId);

      if (updateError) {
        return NextResponse.json(
          { error: `Failed to update resource status: ${updateError.message}` },
          { status: 500 }
        );
      }

      // 5. Send approval email (non-blocking)
      await sendNotificationEmail("APPROVE");

      return NextResponse.json({
        success: true,
        action: "APPROVE",
        fileUrl: publicUrl,
        message: "Resource approved and published successfully.",
      });
    } else {
      // REJECT action
      const { error: updateError } = await adminClient
        .from("resources")
        .update({
          status: "REJECTED",
          rejection_reason: rejectionReason || "Rejected by moderator",
        })
        .eq("id", resourceId);

      if (updateError) {
        return NextResponse.json(
          { error: `Failed to reject resource: ${updateError.message}` },
          { status: 500 }
        );
      }

      // Send rejection email (non-blocking)
      await sendNotificationEmail("REJECT");

      return NextResponse.json({
        success: true,
        action: "REJECT",
        message: "Resource has been rejected.",
      });
    }
  } catch (error) {
    console.error("Admin Approve API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during admin moderation action." },
      { status: 500 }
    );
  }
}
