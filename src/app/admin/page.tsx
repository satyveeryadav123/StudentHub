import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import AdminConsoleClient, {
  AdminPendingResource,
  AdminReport,
  AdminCounts,
  AdminUser,
} from "./AdminConsoleClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?auth=login");
  }

  const adminClient = createAdminClient();

  // Verify admin role server-side
  const { data: profile } = await adminClient
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch pending resources
  const { data: pendingData } = await adminClient
    .from("resources")
    .select("*, profiles:uploaded_by(full_name)")
    .eq("status", "PENDING")
    .order("created_at", { ascending: false });

  // Fetch metrics counts, profiles, and resources
  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
    { count: reportsCount },
    { data: profilesData },
    { data: allResources },
  ] = await Promise.all([
    adminClient.from("resources").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
    adminClient.from("resources").select("*", { count: "exact", head: true }).eq("status", "APPROVED"),
    adminClient.from("resources").select("*", { count: "exact", head: true }).eq("status", "REJECTED"),
    adminClient.from("reports").select("*", { count: "exact", head: true }).eq("status", "OPEN"),
    adminClient.from("profiles").select("*").order("created_at", { ascending: false }),
    adminClient.from("resources").select("uploaded_by"),
  ]);

  // Fetch open reports
  const { data: reportsData } = await adminClient
    .from("reports")
    .select("*, profiles:reported_by(full_name), resources:resource_id(title)")
    .eq("status", "OPEN")
    .order("created_at", { ascending: false });

  // Fetch profiles and users for uploader contact info
  const { data: usersData } = await adminClient.auth.admin.listUsers().catch(() => ({ data: { users: [] } }));
  const userMap = new Map((usersData?.users || []).map((u) => [u.id, u.email || "student@aktu.ac.in"]));

  // Map upload counts per user
  const uploadCountMap = new Map<string, number>();
  (allResources || []).forEach((r) => {
    if (r.uploaded_by) {
      uploadCountMap.set(r.uploaded_by, (uploadCountMap.get(r.uploaded_by) || 0) + 1);
    }
  });

  const registeredUsers: AdminUser[] = (profilesData || []).map((p) => {
    const email = userMap.get(p.id) || "student@aktu.ac.in";
    return {
      id: p.id,
      full_name: p.full_name || null,
      email,
      role: p.role || "student",
      created_at: p.created_at || new Date().toISOString(),
      uploads_count: uploadCountMap.get(p.id) || 0,
      banned: !!p.banned,
      ban_reason: p.ban_reason || null,
      banned_at: p.banned_at || null,
    };
  });

  // Generate signed URLs for pending files so admin can preview private files
  const pendingUploads: AdminPendingResource[] = await Promise.all(
    (pendingData || []).map(async (item) => {
      let viewUrl = item.file_url || "#";
      if (item.file_path) {
        try {
          const { data: signed } = await adminClient.storage
            .from("resources")
            .createSignedUrl(item.file_path, 3600);
          if (signed?.signedUrl) {
            viewUrl = signed.signedUrl;
          }
        } catch (e) {
          console.error("Signed URL error:", e);
        }
      }

      const uploaderProfile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      const uploaderName = uploaderProfile?.full_name || "Student Contributor";
      const uploaderEmail = (item.uploaded_by && userMap.get(item.uploaded_by)) || "student@aktu.ac.in";

      return {
        id: item.id,
        title: item.title,
        type: item.type,
        semester: item.semester,
        subject_slug: item.subject_slug,
        unit_number: item.unit_number,
        year: item.year,
        file_path: item.file_path,
        file_url: item.file_url,
        viewUrl,
        created_at: item.created_at,
        uploaded_by: item.uploaded_by,
        uploader_name: uploaderName,
        uploader_email: uploaderEmail,
      };
    })
  );

  const flaggedReports: AdminReport[] = (reportsData || []).map((rep) => {
    const reporterProfile = Array.isArray(rep.profiles) ? rep.profiles[0] : rep.profiles;
    const resource = Array.isArray(rep.resources) ? rep.resources[0] : rep.resources;

    return {
      id: rep.id,
      resource_id: rep.resource_id,
      resource_title: resource?.title || "Resource File",
      reported_by_name: reporterProfile?.full_name || "Anonymous Student",
      reason: rep.reason,
      status: rep.status,
      created_at: rep.created_at,
    };
  });

  const counts: AdminCounts = {
    pending: pendingCount || 0,
    approved: approvedCount || 0,
    rejected: rejectedCount || 0,
    reports: reportsCount || 0,
    users: registeredUsers.length,
  };

  const adminName =
    profile?.full_name?.trim() ||
    user.email?.split("@")[0] ||
    "System Admin";

  return (
    <AdminConsoleClient
      adminName={adminName}
      initialPending={pendingUploads}
      initialReports={flaggedReports}
      initialUsers={registeredUsers}
      counts={counts}
    />
  );
}
