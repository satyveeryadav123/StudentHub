import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Optional server-side admin secret protection
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    if (adminSecret) {
      const authHeader = request.headers.get("authorization") || request.headers.get("x-admin-key");
      if (!authHeader || authHeader.replace("Bearer ", "") !== adminSecret) {
        return NextResponse.json({ error: "Unauthorized: Invalid admin credentials." }, { status: 401 });
      }
    }

    const body = await request.json();
    const { resourceId, action } = body;

    if (!resourceId || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { error: "Missing or invalid required fields. Action must be 'approve' or 'reject'." },
        { status: 400 }
      );
    }

    console.log(`[Admin Operations] Resource Moderation: ID=${resourceId}, Action=${action.toUpperCase()}`);

    return NextResponse.json({
      success: true,
      message: `Resource has been successfully ${action === "approve" ? "approved and published" : "rejected and removed"}.`,
    });
  } catch (error) {
    console.error("Admin Approval API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
