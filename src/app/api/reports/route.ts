import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resourceId, reason, description } = body;

    if (!resourceId || typeof resourceId !== "string" || !reason || typeof reason !== "string") {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
    }

    const cleanResourceId = resourceId.slice(0, 100);
    const cleanReason = reason.slice(0, 100);
    const cleanDescription = (description ? String(description) : "").slice(0, 500);

    console.log(`[Reports Analytics] Report Logged: ResourceID=${cleanResourceId}, Reason=${cleanReason}`);

    return NextResponse.json({
      success: true,
      message: "Report logged successfully. Our team will review the resource.",
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
