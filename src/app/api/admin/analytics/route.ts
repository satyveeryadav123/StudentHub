import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { SUBJECT_DATA } from "@/lib/subjects";

export async function GET() {
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

    // 1. Fetch real page_views data from Supabase
    let pageViews: any[] = [];
    try {
      const { data: pageViewsData } = await adminClient
        .from("page_views")
        .select("subject_slug, subject_name, semester, viewer_id, viewed_at");
      pageViews = pageViewsData || [];
    } catch {
      pageViews = [];
    }

    // Group page views by subject_slug
    const viewsBySubject = new Map<
      string,
      {
        total_views: number;
        viewers: Set<string>;
        last_visited: string | null;
        daily_counts: number[];
      }
    >();

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    pageViews.forEach((pv: any) => {
      const slug = pv.subject_slug;
      if (!slug) return;

      if (!viewsBySubject.has(slug)) {
        viewsBySubject.set(slug, {
          total_views: 0,
          viewers: new Set<string>(),
          last_visited: null,
          daily_counts: [0, 0, 0, 0, 0, 0, 0],
        });
      }

      const item = viewsBySubject.get(slug)!;
      item.total_views += 1;
      if (pv.viewer_id) {
        item.viewers.add(pv.viewer_id);
      }

      if (pv.viewed_at) {
        if (!item.last_visited || new Date(pv.viewed_at) > new Date(item.last_visited)) {
          item.last_visited = pv.viewed_at;
        }

        const viewDate = new Date(pv.viewed_at);
        const diffDays = Math.floor((today.getTime() - viewDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays < 7) {
          item.daily_counts[6 - diffDays] += 1;
        }
      }
    });

    // 2. Merge all subjects from SUBJECT_DATA
    const allSubjects = [];
    for (const [semKey, semObj] of Object.entries(SUBJECT_DATA)) {
      const semNumber = parseInt(semKey.replace("sem-", ""), 10) || 1;
      for (const subj of semObj.subjects) {
        const stats = viewsBySubject.get(subj.slug);
        const totalViews = stats ? stats.total_views : 0;
        const uniqueVisitors = stats ? stats.viewers.size : 0;
        const lastVisited = stats?.last_visited || null;
        const dailyTrend = stats?.daily_counts || [0, 0, 0, 0, 0, 0, 0];

        allSubjects.push({
          subject_slug: subj.slug,
          subject_name: subj.name,
          subject_code: subj.code,
          semester: semNumber,
          semester_title: semObj.title,
          total_views: totalViews,
          unique_visitors: uniqueVisitors,
          last_visited: lastVisited,
          daily_views_7d: dailyTrend,
          peak_hours: totalViews > 0 ? "2:00 PM - 6:00 PM" : "N/A",
        });
      }
    }

    // Sort by total_views descending by default
    allSubjects.sort((a, b) => b.total_views - a.total_views);

    // 3. Fetch real daily_visits data from Supabase
    let dailyVisits: any[] = [];
    try {
      const { data: dailyVisitsData } = await adminClient
        .from("daily_visits")
        .select("visited_date, visitor_id, created_at");
      dailyVisits = dailyVisitsData || [];
    } catch {
      dailyVisits = [];
    }

    const todayStr = today.toISOString().split("T")[0];
    const yesterdayObj = new Date();
    yesterdayObj.setDate(yesterdayObj.getDate() - 1);
    const yesterdayStr = yesterdayObj.toISOString().split("T")[0];

    const todayVisits = dailyVisits.filter(
      (v: any) => v.visited_date === todayStr || (v.created_at && v.created_at.startsWith(todayStr))
    );
    const yesterdayVisits = dailyVisits.filter(
      (v: any) =>
        v.visited_date === yesterdayStr || (v.created_at && v.created_at.startsWith(yesterdayStr))
    );

    // 7-day chart calculation
    const sevenDayChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });

      const dayVisits = dailyVisits.filter(
        (v: any) => v.visited_date === dateStr || (v.created_at && v.created_at.startsWith(dateStr))
      );
      const uniqueCount = new Set(dayVisits.map((v: any) => v.visitor_id)).size;

      sevenDayChart.push({
        date: dateStr,
        label: dayLabel,
        visits: dayVisits.length,
        unique: uniqueCount,
      });
    }

    const thisWeekTotal = sevenDayChart.reduce((acc, curr) => acc + curr.visits, 0);
    const thisMonthTotal = dailyVisits.length;

    const dailyVisitors = {
      today: todayVisits.length,
      yesterday: yesterdayVisits.length,
      thisWeek: thisWeekTotal,
      thisMonth: thisMonthTotal,
      sevenDayChart,
    };

    // 4. Fetch real Top Downloads from Supabase resources table
    let topDownloads: { title: string; type: string; count: number }[] = [];
    try {
      const { data: topRes } = await adminClient
        .from("resources")
        .select("title, type, downloads")
        .eq("status", "APPROVED")
        .order("downloads", { ascending: false })
        .limit(3);

      topDownloads = (topRes || []).map((r: any) => ({
        title: r.title,
        type: r.type,
        count: r.downloads || 0,
      }));
    } catch {
      topDownloads = [];
    }

    // 5. Fetch real Top Contributors from Supabase
    let topContributors: { name: string; uploads: number; role: string }[] = [];
    try {
      const { data: allApproved } = await adminClient
        .from("resources")
        .select("uploaded_by, profiles:uploaded_by(full_name, role)");

      const uploaderCounts = new Map<string, { name: string; count: number; role: string }>();
      (allApproved || []).forEach((item: any) => {
        if (item.uploaded_by) {
          const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
          const name = profile?.full_name || "Student Contributor";
          const role = profile?.role || "student";
          if (!uploaderCounts.has(item.uploaded_by)) {
            uploaderCounts.set(item.uploaded_by, { name, count: 0, role });
          }
          uploaderCounts.get(item.uploaded_by)!.count += 1;
        }
      });

      topContributors = Array.from(uploaderCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((u) => ({
          name: u.name,
          uploads: u.count,
          role: u.role,
        }));
    } catch {
      topContributors = [];
    }

    return NextResponse.json({
      allSubjects,
      dailyVisitors,
      topDownloads,
      topContributors,
    });
  } catch (error) {
    console.error("Admin Analytics API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during analytics query." },
      { status: 500 }
    );
  }
}
