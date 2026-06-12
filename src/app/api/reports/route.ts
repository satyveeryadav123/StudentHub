import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resourceId, reason, description } = body;

    if (!resourceId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock writing report to database logs for MVP
    console.log(`[Reporting Analytics] New Report Received!
      - Resource ID: ${resourceId}
      - Reason: ${reason}
      - Details: ${description || "None"}
      - Time: ${new Date().toISOString()}
    `);

    // Success response
    return NextResponse.json({
      success: true,
      message: "Report logged successfully. Our team will review the resource.",
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
