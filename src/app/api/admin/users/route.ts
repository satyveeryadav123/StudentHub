import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
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

    // Verify caller is admin
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

    // Fetch profiles
    const { data: profiles, error: getErr } = await adminClient
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (getErr) {
      return NextResponse.json(
        { error: `Failed to fetch profiles: ${getErr.message}` },
        { status: 500 }
      );
    }

    // Fetch auth users for email & auth metadata
    const { data: usersData } = await adminClient.auth.admin
      .listUsers()
      .catch(() => ({ data: { users: [] } }));
    const userMap = new Map(
      (usersData?.users || []).map((u) => [
        u.id,
        { email: u.email || "student@aktu.ac.in", created_at: u.created_at },
      ])
    );

    // Fetch upload count per user
    const { data: resources } = await adminClient
      .from("resources")
      .select("uploaded_by");

    const uploadCountMap = new Map<string, number>();
    (resources || []).forEach((r) => {
      if (r.uploaded_by) {
        uploadCountMap.set(r.uploaded_by, (uploadCountMap.get(r.uploaded_by) || 0) + 1);
      }
    });

    const userList = (profiles || []).map((p) => {
      const authInfo = userMap.get(p.id);
      return {
        id: p.id,
        full_name: p.full_name || null,
        email: authInfo?.email || "student@aktu.ac.in",
        role: p.role || "student",
        created_at: p.created_at || authInfo?.created_at || new Date().toISOString(),
        uploads_count: uploadCountMap.get(p.id) || 0,
        banned: !!p.banned,
        ban_reason: p.ban_reason || null,
        banned_at: p.banned_at || null,
      };
    });

    return NextResponse.json({ users: userList });
  } catch (error) {
    console.error("Admin Users GET API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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

    // Verify caller is admin
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
    const { userId, action, reason } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields: userId and action are required." },
        { status: 400 }
      );
    }

    const normalizedAction = (action as string).toUpperCase();

    if (normalizedAction === "BAN") {
      const banReason =
        (reason as string)?.trim() || "Violating platform terms & community guidelines";
      const bannedAt = new Date().toISOString();

      // Update profiles
      const { error: updateErr } = await adminClient
        .from("profiles")
        .update({
          banned: true,
          ban_reason: banReason,
          banned_at: bannedAt,
        })
        .eq("id", userId);

      if (updateErr) {
        return NextResponse.json(
          { error: `Failed to update profile ban status: ${updateErr.message}` },
          { status: 500 }
        );
      }

      // Delete auth account so user cannot login again
      try {
        await adminClient.auth.admin.deleteUser(userId);
      } catch (authErr) {
        console.error("Failed to delete auth user upon ban:", authErr);
      }

      return NextResponse.json({
        success: true,
        action: "BAN",
        userId,
        banReason,
        bannedAt,
        message: "User has been permanently banned and removed from active authentication.",
      });
    } else if (normalizedAction === "UNBAN") {
      const { error: updateErr } = await adminClient
        .from("profiles")
        .update({
          banned: false,
          ban_reason: null,
          banned_at: null,
        })
        .eq("id", userId);

      if (updateErr) {
        return NextResponse.json(
          { error: `Failed to unban user: ${updateErr.message}` },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "UNBAN",
        userId,
        message: "User ban has been lifted.",
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Must be 'BAN' or 'UNBAN'." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Admin Users POST API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during user moderation action." },
      { status: 500 }
    );
  }
}
