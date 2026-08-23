import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_EXTENSIONS = ["pdf"];
const ALLOWED_MIME_TYPES = ["application/pdf"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string | null)?.trim();
    const type = (formData.get("type") as string | null)?.trim();
    const semester = (formData.get("semester") as string | null)?.trim();
    const subject = (formData.get("subject") as string | null)?.trim();
    const unit = (formData.get("unit") as string | null)?.trim();

    if (!file || !title || !type || !semester || !subject || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Security: Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File exceeds the 25MB maximum size limit." },
        { status: 400 }
      );
    }

    // Security: Validate file extension & MIME type
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(fileExtension) || !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only valid PDF files (.pdf) are permitted." },
        { status: 400 }
      );
    }

    // Define local upload path: /public/uploads/
    const uploadDir = join(process.cwd(), "public", "uploads");
    
    // Ensure the folder exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Security: Sanitize filename to prevent directory traversal
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 80);
    const safeFileName = `${Date.now()}-${cleanTitle}.pdf`;
    const filePath = join(uploadDir, safeFileName);

    // Save file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(filePath, new Uint8Array(buffer));

    const fileUrl = `/uploads/${safeFileName}`;

    return NextResponse.json({
      success: true,
      message: "Resource uploaded successfully. Awaiting moderator review.",
      resource: {
        title,
        type,
        fileUrl,
        fileSizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(2)),
        semester,
        subject,
        unit,
      },
    });
  } catch (error) {
    console.error("Upload API Error:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error during upload processing." },
      { status: 500 }
    );
  }
}
