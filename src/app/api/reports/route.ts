import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

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

    const body = await request.json();
    const { action, reportId, resourceId, reason, description } = body;

    // Handle RESOLVE action for Admin
    if (action === "RESOLVE" || action === "resolve") {
      if (!reportId || typeof reportId !== "string") {
        return NextResponse.json(
          { error: "Missing required field: reportId is required to resolve." },
          { status: 400 }
        );
      }

      const adminClient = createAdminClient();

      // Verify caller is admin
      const { data: profile, error: profileErr } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileErr || profile?.role !== "admin") {
        return NextResponse.json(
          { error: "Forbidden: Admin privileges required to resolve reports." },
          { status: 403 }
        );
      }

      const { error: updateError } = await adminClient
        .from("reports")
        .update({ status: "RESOLVED" })
        .eq("id", reportId);

      if (updateError) {
        console.error("Reports Resolve Error:", updateError);
        return NextResponse.json(
          { error: `Failed to resolve report: ${updateError.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Report marked as resolved successfully.",
      });
    }

    // Default action: Create a new report
    if (!resourceId || typeof resourceId !== "string" || !reason || typeof reason !== "string") {
      return NextResponse.json(
        { error: "Missing required fields: resourceId and reason are required." },
        { status: 400 }
      );
    }

    const fullReason = description && typeof description === "string" && description.trim()
      ? `${reason.trim()}: ${description.trim()}`
      : reason.trim();

    const { error: insertError } = await supabase
      .from("reports")
      .insert({
        resource_id: resourceId,
        reported_by: user.id,
        reason: fullReason,
        status: "OPEN",
      });

    if (insertError) {
      console.error("Reports DB Error:", insertError);
      return NextResponse.json(
        { error: `Failed to record report: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Report logged successfully. Our team will review the resource.",
    });
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during report operation." },
      { status: 500 }
    );
  }
}

