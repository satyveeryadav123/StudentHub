import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });
    }

    const adminClient = createAdminClient();

    // Fetch current downloads count
    const { data: resource, error: getErr } = await adminClient
      .from("resources")
      .select("downloads")
      .eq("id", id)
      .single();

    if (!getErr && resource) {
      const currentDownloads = resource.downloads || 0;
      await adminClient
        .from("resources")
        .update({ downloads: currentDownloads + 1 })
        .eq("id", id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Download tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  return POST(request, { params });
}
