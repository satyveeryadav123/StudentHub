import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resourceId, action } = body; // action is "approve" or "reject"

    if (!resourceId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock moderation logic for MVP
    console.log(`[Admin Operations] Moderation Action Performed!
      - Resource ID: ${resourceId}
      - Action: ${action.toUpperCase()}
      - Timestamp: ${new Date().toISOString()}
    `);

    return NextResponse.json({
      success: true,
      message: `Resource has been successfully ${action === "approve" ? "approved and published" : "rejected and removed"}.`,
    });
  } catch (error) {
    console.error("Admin Approval API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
