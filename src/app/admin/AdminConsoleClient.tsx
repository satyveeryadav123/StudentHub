"use client";

import React, { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export interface AdminPendingResource {
  id: string;
  title: string;
  type: string;
  semester: number | null;
  subject_slug: string | null;
  unit_number: number | null;
  year: number | null;
  file_path: string;
  file_url: string;
  viewUrl: string;
  created_at: string;
  uploaded_by: string | null;
  uploader_name: string;
  uploader_email: string;
}

export interface AdminReport {
  id: string;
  resource_id: string;
  resource_title: string;
  reported_by_name: string;
  reason: string;
  status: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  full_name: string | null;
  email: string;
  role: "student" | "admin";
  created_at: string;
  uploads_count: number;
  banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
}

export interface AdminCounts {
  pending: number;
  approved: number;
  rejected: number;
  reports: number;
  users?: number;
}

export interface SubjectViewStat {
  subject_slug: string;
  subject_name: string;
  subject_code: string;
  semester: number;
  semester_title?: string;
  total_views: number;
  unique_visitors: number;
  last_visited: string | null;
  daily_views_7d: number[];
  peak_hours?: string;
}

export interface DailyVisitorStat {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  sevenDayChart: {
    date: string;
    label: string;
    visits: number;
    unique: number;
  }[];
}

interface AnalyticsPayload {
  allSubjects: SubjectViewStat[];
  dailyVisitors: DailyVisitorStat | null;
  topDownloads?: { title: string; type: string; count: number }[];
  topContributors?: { name: string; uploads: number; role: string }[];
}

interface AdminConsoleClientProps {
  adminName?: string;
  initialPending: AdminPendingResource[];
  initialReports: AdminReport[];
  initialUsers?: AdminUser[];
  counts: AdminCounts;
}

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

function formatTimeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AdminConsoleClient({
  adminName = "System Admin",
  initialPending,
  initialReports,
  initialUsers = [],
  counts: initialCounts,
}: AdminConsoleClientProps) {
  const router = useRouter();
  const { profile, user } = useAuth();
  const displayName =
    profile?.full_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "") ||
    adminName;

  const [activeTab, setActiveTab] = useState<"queue" | "reports" | "analytics" | "users">("queue");
  const [pendingUploads, setPendingUploads] = useState<AdminPendingResource[]>(initialPending);
  const [flaggedReports, setFlaggedReports] = useState<AdminReport[]>(initialReports);
  const [usersList, setUsersList] = useState<AdminUser[]>(initialUsers);
  const [counts, setCounts] = useState<AdminCounts>(initialCounts);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUploaderFilter, setSelectedUploaderFilter] = useState<string | null>(null);
  const [banningUser, setBanningUser] = useState<AdminUser | null>(null);
  const [banReasonInput, setBanReasonInput] = useState("");
  const [isBanning, setIsBanning] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsPayload | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState<string>("all");
  const [subjectSortBy, setSubjectSortBy] = useState<"most_viewed" | "least_viewed" | "semester" | "name">("most_viewed");
  const [expandedSubjectSlug, setExpandedSubjectSlug] = useState<string | null>(null);

  // Fetch Analytics on Tab Switch
  useEffect(() => {
    if (activeTab === "analytics" && !analyticsData && !isLoadingAnalytics) {
      setIsLoadingAnalytics(true);
      fetch("/api/admin/analytics")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.allSubjects) {
            setAnalyticsData(data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch analytics:", err);
        })
        .finally(() => {
          setIsLoadingAnalytics(false);
        });
    }
  }, [activeTab, analyticsData, isLoadingAnalytics]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((curr) => [...curr, { id, text, type }]);
    setTimeout(() => {
      setToasts((curr) => curr.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleModerate = async (id: string, action: "approve" | "reject", reason?: string) => {
    setProcessingId(id);
    const targetItem = pendingUploads.find((item) => item.id === id);

    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: id,
          action: action.toUpperCase(),
          rejectionReason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setPendingUploads((curr) => curr.filter((item) => item.id !== id));
        setCounts((curr) => ({
          ...curr,
          pending: Math.max(0, curr.pending - 1),
          approved: action === "approve" ? curr.approved + 1 : curr.approved,
          rejected: action === "reject" ? curr.rejected + 1 : curr.rejected,
        }));
        setRejectingId(null);
        setRejectionReason("");
        showToast(
          action === "approve"
            ? `Approved "${targetItem?.title || "Resource"}" successfully.`
            : `Rejected "${targetItem?.title || "Resource"}".`
        );
        router.refresh();
      } else {
        showToast(data.error || `Failed to ${action} resource.`, "error");
      }
    } catch (err) {
      console.error(err);
      showToast(`An error occurred while attempting to ${action} resource.`, "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleResolveReport = async (id: string) => {
    setProcessingId(id);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: id,
          action: "RESOLVE",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFlaggedReports((curr) => curr.filter((item) => item.id !== id));
        setCounts((curr) => ({
          ...curr,
          reports: Math.max(0, curr.reports - 1),
        }));
        showToast("Report marked as resolved.", "success");
        router.refresh();
      } else {
        showToast(data.error || "Failed to resolve report.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error occurred while resolving report.", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const handleConfirmBan = async () => {
    if (!banningUser) return;
    if (!banReasonInput.trim()) {
      showToast("Please provide a reason for the ban.", "error");
      return;
    }

    setIsBanning(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: banningUser.id,
          action: "BAN",
          reason: banReasonInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList((prev) =>
          prev.map((u) =>
            u.id === banningUser.id
              ? {
                  ...u,
                  banned: true,
                  ban_reason: data.banReason || banReasonInput.trim(),
                  banned_at: data.bannedAt || new Date().toISOString(),
                }
              : u
          )
        );
        showToast(
          `Permanently banned ${banningUser.full_name || banningUser.email}.`,
          "success"
        );
        setBanningUser(null);
        setBanReasonInput("");
        router.refresh();
      } else {
        showToast(data.error || "Failed to ban user.", "error");
      }
    } catch (err) {
      console.error("Ban error:", err);
      showToast("Network error occurred while banning user.", "error");
    } finally {
      setIsBanning(false);
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const q = userSearchQuery.toLowerCase().trim();
    if (!q) return true;
    const nameMatch = u.full_name?.toLowerCase().includes(q);
    const emailMatch = u.email.toLowerCase().includes(q);
    return nameMatch || emailMatch;
  });

  // Filtered Pending Queue
  const displayedPendingUploads = selectedUploaderFilter
    ? pendingUploads.filter((item) => item.uploaded_by === selectedUploaderFilter)
    : pendingUploads;

  const filterUserObj = selectedUploaderFilter
    ? usersList.find((u) => u.id === selectedUploaderFilter)
    : null;

  // Analytics Processing
  const rawSubjects = analyticsData?.allSubjects || [];

  // Determine top 3 most viewed across the entire catalog
  const topThreeSlugs = [...rawSubjects]
    .filter((s) => s.total_views > 0)
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 3)
    .map((s) => s.subject_slug);

  const filteredSubjects = rawSubjects
    .filter((sub) => {
      // Semester filter
      if (selectedSemesterFilter !== "all") {
        if (sub.semester !== parseInt(selectedSemesterFilter, 10)) {
          return false;
        }
      }
      // Search filter
      const q = subjectSearchQuery.toLowerCase().trim();
      if (q) {
        const nameMatch = sub.subject_name.toLowerCase().includes(q);
        const codeMatch = sub.subject_code.toLowerCase().includes(q);
        const slugMatch = sub.subject_slug.toLowerCase().includes(q);
        if (!nameMatch && !codeMatch && !slugMatch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (subjectSortBy === "most_viewed") {
        return b.total_views - a.total_views;
      } else if (subjectSortBy === "least_viewed") {
        return a.total_views - b.total_views;
      } else if (subjectSortBy === "semester") {
        return a.semester - b.semester || b.total_views - a.total_views;
      } else if (subjectSortBy === "name") {
        return a.subject_name.localeCompare(b.subject_name);
      }
      return 0;
    });

  // Real analytics derived lists
  const realTopSubjects = rawSubjects
    .filter((s) => s.total_views > 0)
    .sort((a, b) => b.total_views - a.total_views)
    .slice(0, 3);

  const realTopDownloads = analyticsData?.topDownloads || [];
  const realTopContributors = analyticsData?.topContributors || [];

  const dailyVisitors = analyticsData?.dailyVisitors;
  const maxVisitorCount = dailyVisitors?.sevenDayChart
    ? Math.max(...dailyVisitors.sevenDayChart.map((d) => d.visits), 5)
    : 5;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border text-xs font-bold transition-all animate-fadeIn ${
              t.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/30 text-emerald-200"
                : "bg-rose-950/80 border-rose-500/30 text-rose-200"
            }`}
          >
            <span>{t.type === "success" ? "✅" : "⚠️"}</span>
            <span>{t.text}</span>
          </div>
        ))}
      </div>

      {/* BAN CONFIRMATION MODAL */}
      {banningUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-[#090d16] border border-rose-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-xl">
                ⚠️
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Confirm Permanent Ban
                </h3>
                <p className="text-[11px] text-slate-500">
                  Account Termination & Access Revocation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently ban{" "}
              <strong className="text-slate-900 dark:text-white">
                {banningUser.full_name || banningUser.email}
              </strong>
              ? Their authentication account will be deleted and they will never be able to login again.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Reason for Ban <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={banReasonInput}
                onChange={(e) => setBanReasonInput(e.target.value)}
                placeholder="e.g. Uploading corrupted files / spam content / violating platform guidelines..."
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBanningUser(null);
                  setBanReasonInput("");
                }}
                disabled={isBanning}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBan}
                disabled={isBanning || !banReasonInput.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50"
              >
                {isBanning ? "Banning User..." : "Confirm Ban"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Admin Profile Info */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/5 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
              Admin Moderation Console
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/25 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              Admin Panel
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Logged in as <span className="font-semibold text-slate-900 dark:text-white">{displayName}</span> • Real-time student verification portal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            <span>📤</span>
            <span>Upload Notes/PYQ</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#090d16] px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyber-blue hover:border-cyber-blue/30 transition-all shadow-sm"
          >
            <span>←</span>
            <span>Back to Site</span>
          </Link>
        </div>
      </section>

      {/* TOP ROW — 4 Stat Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pending (Yellow) */}
        <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-amber-500/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xl">⏳</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              Pending
            </span>
          </div>
          <div className="mt-4">
            <div className="font-heading text-3xl font-black text-amber-500">{counts.pending}</div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Total Pending
            </p>
          </div>
        </div>

        {/* Total Approved (Green) */}
        <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-emerald-500/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xl">✅</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Approved
            </span>
          </div>
          <div className="mt-4">
            <div className="font-heading text-3xl font-black text-emerald-500">{counts.approved}</div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Total Approved
            </p>
          </div>
        </div>

        {/* Total Rejected (Red) */}
        <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-rose-500/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xl">❌</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
              Rejected
            </span>
          </div>
          <div className="mt-4">
            <div className="font-heading text-3xl font-black text-rose-500">{counts.rejected}</div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Total Rejected
            </p>
          </div>
        </div>

        {/* Total Reports (Blue) */}
        <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-cyber-blue/30 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xl">🚩</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
              Active Reports
            </span>
          </div>
          <div className="mt-4">
            <div className="font-heading text-3xl font-black text-cyber-blue">{counts.reports}</div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
              Total Reports
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/5 gap-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "queue"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          Pending ({pendingUploads.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === "reports"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          Reports ({flaggedReports.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === "analytics"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          <span>📊 Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === "users"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          <span>👥 Users</span>
          <span>({usersList.length})</span>
        </button>
      </div>

      {/* MAIN SECTION: Submissions / Reports / Analytics / Users */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* TAB 1: Pending Submissions Table */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Pending Submissions Moderation Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review student uploads, check content validity, approve or reject with feedback.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedUploaderFilter && (
                  <button
                    onClick={() => setSelectedUploaderFilter(null)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl hover:bg-rose-500/20 transition-colors"
                  >
                    <span>Filtered: {filterUserObj?.full_name || "User"}</span>
                    <span>✕ Clear</span>
                  </button>
                )}
                <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                  {displayedPendingUploads.length} pending
                </span>
              </div>
            </div>

            {displayedPendingUploads.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                <span className="text-3xl">✨</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">All submissions are up to date!</p>
                <p className="text-xs text-slate-500">
                  {selectedUploaderFilter
                    ? "No pending submissions from this filtered user."
                    : "No pending student notes or PYQs in the moderation queue."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Title & Type</th>
                      <th className="py-3 px-3">Subject / Sem</th>
                      <th className="py-3 px-3">Uploader</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-xs">
                    {displayedPendingUploads.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        {/* Title & Type */}
                        <td className="py-4 px-3 max-w-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                              {item.type}
                            </span>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-2 mt-1">
                              {item.title}
                            </div>
                            {item.unit_number && (
                              <span className="text-[10px] text-slate-500">Unit {item.unit_number}</span>
                            )}
                          </div>
                        </td>

                        {/* Subject / Sem */}
                        <td className="py-4 px-3">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {item.subject_slug || "General"}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.semester ? `Semester ${item.semester}` : "N/A"}
                            </div>
                          </div>
                        </td>

                        {/* Uploader */}
                        <td className="py-4 px-3">
                          <div className="space-y-0.5">
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {item.uploader_name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {item.uploader_email}
                            </div>
                          </div>
                        </td>

                        {/* Upload Date */}
                        <td className="py-4 px-3 whitespace-nowrap text-slate-500">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-3 text-right">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              {/* Preview Button */}
                              <a
                                href={item.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                Preview ↗
                              </a>

                              {/* Reject Button */}
                              <button
                                onClick={() => {
                                  if (rejectingId === item.id) {
                                    setRejectingId(null);
                                  } else {
                                    setRejectingId(item.id);
                                    setRejectionReason("");
                                  }
                                }}
                                disabled={processingId === item.id}
                                className="rounded-lg border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
                              >
                                Reject
                              </button>

                              {/* Approve Button */}
                              <button
                                onClick={() => handleModerate(item.id, "approve")}
                                disabled={processingId === item.id}
                                className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-md shadow-emerald-600/20 disabled:opacity-50"
                              >
                                {processingId === item.id ? "..." : "Approve"}
                              </button>
                            </div>

                            {/* Inline Rejection Reason Prompt */}
                            {rejectingId === item.id && (
                              <div className="w-full max-w-sm p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-left space-y-2 animate-fadeIn">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                                  Rejection Reason:
                                </label>
                                <input
                                  type="text"
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="e.g. Broken PDF, missing pages, wrong subject..."
                                  className="w-full text-xs p-2 rounded-lg bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-rose-500"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                                    className="px-2.5 py-1 bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleModerate(item.id, "reject", rejectionReason)}
                                    disabled={processingId === item.id}
                                    className="px-3 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors"
                                  >
                                    Confirm Reject
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Recent Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Recent Problem Reports
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Flags submitted by students for broken links, corrupted files, or inappropriate content.
                </p>
              </div>
              <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/10 px-3 py-1 rounded-xl border border-cyber-blue/20">
                {flaggedReports.length} open
              </span>
            </div>

            {flaggedReports.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                <span className="text-3xl">🎉</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No open issue reports!</p>
                <p className="text-xs text-slate-500">All student-reported resources have been addressed.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-white/5 space-y-4">
                {flaggedReports.map((report) => (
                  <div key={report.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/25">
                          {report.reason.split(":")[0]}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{report.resource_title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-white/[0.01] p-3 rounded-xl border border-slate-200 dark:border-white/5">
                        &quot;{report.reason}&quot;
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600">
                        Reported by: <span className="font-semibold text-slate-700 dark:text-slate-300">{report.reported_by_name}</span> • Date: {new Date(report.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>

                    <button
                      onClick={() => handleResolveReport(report.id)}
                      disabled={processingId === report.id}
                      className="w-full md:w-auto shrink-0 rounded-xl border border-emerald-500/25 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {processingId === report.id ? "Resolving..." : "Mark Resolved ✓"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Portal Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-10">
            
            {/* SECTION 1: Daily Visitors Card */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-white/5 pb-3">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>👥</span>
                    <span>Daily Visitors Overview</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time unique traffic and 7-day visitor distribution across StudentHub
                  </p>
                </div>
                {isLoadingAnalytics && (
                  <span className="text-xs font-bold text-cyber-blue animate-pulse">
                    Updating metrics...
                  </span>
                )}
              </div>

              {/* 4 Quick Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Today</div>
                  <div className="text-2xl font-extrabold text-cyber-blue mt-1">
                    {dailyVisitors?.today ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Unique Visitors</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Yesterday</div>
                  <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                    {dailyVisitors?.yesterday ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Unique Visitors</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">This Week</div>
                  <div className="text-2xl font-extrabold text-emerald-500 mt-1">
                    {dailyVisitors?.thisWeek ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Total Visits</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">This Month</div>
                  <div className="text-2xl font-extrabold text-purple-500 mt-1">
                    {dailyVisitors?.thisMonth ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Cumulative Logs</div>
                </div>
              </div>

              {/* 7-Day Bar Chart */}
              <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-[#060911] border border-slate-200 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    📈 7-Day Activity Trend
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">Daily Unique Visitors</span>
                </div>

                <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-6 pb-2 border-b border-slate-200 dark:border-white/10">
                  {dailyVisitors?.sevenDayChart && dailyVisitors.sevenDayChart.length > 0 ? (
                    dailyVisitors.sevenDayChart.map((d, i) => {
                      const heightPercent = Math.max(8, Math.round((d.visits / maxVisitorCount) * 100));
                      const isToday = i === 6;

                      return (
                        <div key={d.date} className="flex flex-col items-center gap-2 h-full justify-end group">
                          {/* Count Tooltip / Label */}
                          <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyber-blue transition-colors">
                            {d.visits}
                          </span>
                          
                          {/* Bar */}
                          <div className="w-full max-w-[36px] bg-slate-200 dark:bg-white/5 rounded-t-lg overflow-hidden flex items-end h-full">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-lg transition-all duration-500 ${
                                isToday
                                  ? "bg-gradient-to-t from-cyber-blue to-cyan-400 shadow-md shadow-cyber-blue/30"
                                  : "bg-gradient-to-t from-blue-700/60 to-cyber-blue/80 hover:from-cyber-blue hover:to-cyan-400"
                              }`}
                            />
                          </div>

                          {/* Day Label */}
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            isToday ? "text-cyber-blue font-extrabold" : "text-slate-500"
                          }`}>
                            {d.label}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-7 h-full flex items-center justify-center text-xs text-slate-500">
                      Gathering daily traffic logs...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: Top Events / Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1: Viewed Subjects */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  🔥 Most Viewed Subjects
                </h4>
                {realTopSubjects.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center text-xs text-slate-400 italic">
                    No subject views recorded yet
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-xs">
                    {realTopSubjects.map((sub, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="truncate pr-2">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{sub.subject_name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{sub.subject_code}</div>
                        </div>
                        <span className="shrink-0 text-cyber-blue font-extrabold">{sub.total_views} views</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Box 2: Top Downloads */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  📥 Top Downloaded Notes
                </h4>
                {realTopDownloads.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center text-xs text-slate-400 italic">
                    No note downloads recorded yet
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-xs">
                    {realTopDownloads.map((dl, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="truncate pr-2">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{dl.title}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{dl.type}</div>
                        </div>
                        <span className="shrink-0 text-cyber-indigo font-extrabold">{dl.count} downloads</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Box 3: Top Contributors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  🏆 Top Student Contributors
                </h4>
                {realTopContributors.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-center text-xs text-slate-400 italic">
                    No student uploads recorded yet
                  </div>
                ) : (
                  <ul className="space-y-2.5 text-xs">
                    {realTopContributors.map((c, idx) => (
                      <li key={idx} className="flex justify-between items-center p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="truncate pr-2">
                          <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{c.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 uppercase font-semibold">{c.role}</div>
                        </div>
                        <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-extrabold">{c.uploads} upload{c.uploads > 1 ? "s" : ""}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* SECTION 3: All Subjects View Statistics */}
            <div className="space-y-6 pt-4 border-t border-slate-200/80 dark:border-white/5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>📚</span>
                    <span>All Subjects — View Statistics</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing <span className="font-bold text-slate-800 dark:text-slate-200">{filteredSubjects.length}</span> of{" "}
                    <span className="font-bold text-slate-800 dark:text-slate-200">{rawSubjects.length}</span> subjects across all AKTU semesters
                  </p>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Sort by:</label>
                  <select
                    value={subjectSortBy}
                    onChange={(e) => setSubjectSortBy(e.target.value as any)}
                    aria-label="Sort subjects by"
                    className="text-xs py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#111726] border border-slate-200 dark:border-white/10 outline-none font-bold text-slate-800 dark:text-slate-200 focus:border-cyber-blue"
                  >
                    <option value="most_viewed">Most Viewed 🔥</option>
                    <option value="least_viewed">Least Viewed</option>
                    <option value="semester">Semester (1 → 8)</option>
                    <option value="name">Subject Name (A → Z)</option>
                  </select>
                </div>
              </div>

              {/* Filters Bar: Search + Semester Tabs */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* Semester Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <button
                    onClick={() => setSelectedSemesterFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedSemesterFilter === "all"
                        ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/25"
                        : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    All Semesters
                  </button>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button
                      key={sem}
                      onClick={() => setSelectedSemesterFilter(sem.toString())}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedSemesterFilter === sem.toString()
                          ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/25"
                          : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="w-full lg:w-72 shrink-0">
                  <input
                    type="text"
                    value={subjectSearchQuery}
                    onChange={(e) => setSubjectSearchQuery(e.target.value)}
                    placeholder="Search subject name or code..."
                    className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-cyber-blue transition-colors"
                  />
                </div>
              </div>

              {/* Subject Table */}
              {isLoadingAnalytics ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-cyber-blue border-t-transparent" />
                  <p className="text-xs text-slate-500 font-bold">Loading subject view statistics...</p>
                </div>
              ) : filteredSubjects.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                  <span className="text-3xl">📚</span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {rawSubjects.length === 0
                      ? "No view data yet. Data appears as students browse subject pages."
                      : "No subjects match your filter."}
                  </p>
                  <p className="text-xs text-slate-500">
                    {rawSubjects.length === 0
                      ? "Browse subject study materials to populate real-time view telemetry."
                      : "Try resetting your search query or semester selection."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-3.5 px-4">Subject Name</th>
                        <th className="py-3.5 px-3">Subject Code</th>
                        <th className="py-3.5 px-3">Semester</th>
                        <th className="py-3.5 px-3 text-center">Total Views</th>
                        <th className="py-3.5 px-3 text-center">Unique Visitors</th>
                        <th className="py-3.5 px-3">Last Visited</th>
                        <th className="py-3.5 px-4 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-xs">
                      {filteredSubjects.map((sub) => {
                        const topIdx = topThreeSlugs.indexOf(sub.subject_slug);
                        const isExpanded = expandedSubjectSlug === sub.subject_slug;
                        const medal =
                          topIdx === 0 ? "🥇" : topIdx === 1 ? "🥈" : topIdx === 2 ? "🥉" : null;

                        return (
                          <React.Fragment key={sub.subject_slug}>
                            <tr
                              className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors ${
                                isExpanded ? "bg-cyber-blue/5 dark:bg-cyber-blue/[0.03]" : ""
                              }`}
                            >
                              {/* Subject Name + Medal */}
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  {medal && (
                                    <span className="text-base shrink-0" title={`Top #${topIdx + 1} Viewed Subject`}>
                                      {medal}
                                    </span>
                                  )}
                                  <div>
                                    <div className="font-bold text-slate-900 dark:text-white">
                                      {sub.subject_name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                      {sub.subject_slug}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Subject Code */}
                              <td className="py-3.5 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                                {sub.subject_code}
                              </td>

                              {/* Semester Badge */}
                              <td className="py-3.5 px-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                                  Sem {sub.semester}
                                </span>
                              </td>

                              {/* Total Views */}
                              <td className="py-3.5 px-3 text-center">
                                <span className="inline-flex items-center gap-1 font-extrabold text-slate-900 dark:text-white">
                                  <span>👁</span>
                                  <span>{sub.total_views}</span>
                                </span>
                              </td>

                              {/* Unique Visitors */}
                              <td className="py-3.5 px-3 text-center">
                                <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                  <span>👤</span>
                                  <span>{sub.unique_visitors}</span>
                                </span>
                              </td>

                              {/* Last Visited */}
                              <td className="py-3.5 px-3 whitespace-nowrap">
                                {sub.total_views === 0 || !sub.last_visited ? (
                                  <span className="text-slate-400 dark:text-slate-600 italic">
                                    No visits yet
                                  </span>
                                ) : (
                                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                                    {formatTimeAgo(sub.last_visited)}
                                  </span>
                                )}
                              </td>

                              {/* View Details Button */}
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedSubjectSlug(isExpanded ? null : sub.subject_slug)
                                  }
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                                    isExpanded
                                      ? "bg-cyber-blue text-white border-cyber-blue shadow-sm"
                                      : "border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300"
                                  }`}
                                >
                                  {isExpanded ? "Hide Details ▲" : "View Details ▼"}
                                </button>
                              </td>
                            </tr>

                            {/* Accordion Row */}
                            {isExpanded && (
                              <tr className="bg-slate-50/70 dark:bg-white/[0.01] border-b border-slate-200 dark:border-white/5">
                                <td colSpan={7} className="p-4 sm:p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-[#090d16] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner">
                                    {/* 7-Day Views Mini Bar Chart */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                          📊 Daily Views (Last 7 Days)
                                        </h5>
                                        <span className="text-[10px] text-slate-500">
                                          Total: {sub.daily_views_7d.reduce((a, b) => a + b, 0)} views
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-7 gap-2 items-end h-24 pt-4 border-b border-slate-200 dark:border-white/10">
                                        {sub.daily_views_7d.map((val, dIdx) => {
                                          const maxVal = Math.max(...sub.daily_views_7d, 1);
                                          const hPercent = Math.max(10, Math.round((val / maxVal) * 100));
                                          const dayLabels = ["-6d", "-5d", "-4d", "-3d", "-2d", "Yest", "Today"];

                                          return (
                                            <div key={dIdx} className="flex flex-col items-center gap-1 h-full justify-end">
                                              <span className="text-[9px] font-bold text-slate-400">{val}</span>
                                              <div className="w-full max-w-[20px] bg-slate-200 dark:bg-white/5 rounded-t overflow-hidden flex items-end h-full">
                                                <div
                                                  style={{ height: `${hPercent}%` }}
                                                  className="w-full bg-cyber-blue rounded-t"
                                                />
                                              </div>
                                              <span className="text-[9px] text-slate-500">{dayLabels[dIdx]}</span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    {/* Audience Analytics & Link */}
                                    <div className="flex flex-col justify-between space-y-4">
                                      <div className="space-y-2">
                                        <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                                          ⏱ Viewer Distribution & Activity
                                        </h5>
                                        <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                                          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                                            <span>Peak Viewing Hours:</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                              {sub.peak_hours || "2:00 PM - 6:00 PM"}
                                            </span>
                                          </div>
                                          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
                                            <span>Semester Context:</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                              Semester {sub.semester}
                                            </span>
                                          </div>
                                          <div className="flex justify-between py-1">
                                            <span>Telemetry Status:</span>
                                            <span className="font-bold text-emerald-500">
                                              Active Tracking ✓
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-2">
                                        <Link
                                          href={`/notes/sem-${sub.semester}/${sub.subject_slug}`}
                                          target="_blank"
                                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-cyber-blue hover:text-white border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                                        >
                                          <span>Open Subject Page</span>
                                          <span>↗</span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: User Management */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  User Management Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {usersList.length} registered students
                  </span>{" "}
                  • Monitor contributor accounts and manage access permissions.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full sm:w-72">
                <input
                  type="text"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full text-xs p-2.5 rounded-xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/10 outline-none text-slate-900 dark:text-white focus:border-cyber-blue transition-colors"
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl space-y-2">
                <span className="text-3xl">👥</span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No users found</p>
                <p className="text-xs text-slate-500">No registered students match your search criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">User / Contributor</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Joined Date</th>
                      <th className="py-3 px-3 text-center">Uploads</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-xs">
                    {filteredUsers.map((item) => {
                      const initial = (item.full_name || item.email || "S").charAt(0).toUpperCase();
                      const isItemAdmin = item.role === "admin" || (item.role as string)?.toLowerCase() === "admin";

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            item.banned
                              ? "bg-rose-500/5 dark:bg-rose-950/20 hover:bg-rose-500/10"
                              : "hover:bg-slate-50/50 dark:hover:bg-white/[0.02]"
                          }`}
                        >
                          {/* Avatar & Full Name */}
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm ${
                                  item.banned
                                    ? "bg-rose-600"
                                    : isItemAdmin
                                    ? "bg-gradient-to-tr from-rose-500 to-amber-500"
                                    : "bg-gradient-to-tr from-cyber-blue to-cyber-indigo"
                                }`}
                              >
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 dark:text-white truncate">
                                  {item.full_name || "Anonymous Student"}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-4 px-3 text-slate-600 dark:text-slate-400 font-medium">
                            {item.email}
                          </td>

                          {/* Role Badge */}
                          <td className="py-4 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                isItemAdmin
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25"
                                  : "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20"
                              }`}
                            >
                              {isItemAdmin ? "Admin" : "Student"}
                            </span>
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-3 whitespace-nowrap text-slate-500">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>

                          {/* Uploads Count */}
                          <td className="py-4 px-3 text-center">
                            <span className="font-extrabold text-slate-800 dark:text-slate-200">
                              {item.uploads_count}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-3">
                            {item.banned ? (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                  <span>🔴</span>
                                  <span>Banned</span>
                                </span>
                                {item.ban_reason && (
                                  <div className="text-[10px] text-rose-500/80 italic max-w-xs truncate" title={item.ban_reason}>
                                    &quot;{item.ban_reason}&quot;
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                <span>🟢</span>
                                <span>Active</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Uploads Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUploaderFilter(item.id);
                                  setActiveTab("queue");
                                }}
                                className="rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                View Uploads
                              </button>

                              {/* Ban User Button (Only if not already banned and not self/admin) */}
                              {!item.banned && !isItemAdmin ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setBanningUser(item);
                                    setBanReasonInput("");
                                  }}
                                  className="rounded-lg border border-rose-500/25 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2.5 py-1.5 text-xs font-bold transition-colors"
                                >
                                  Ban User
                                </button>
                              ) : item.banned ? (
                                <span className="text-[11px] font-semibold text-rose-500">
                                  Access Revoked
                                </span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
