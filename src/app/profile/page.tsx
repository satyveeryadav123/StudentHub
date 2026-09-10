"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface UserStats {
  totalUploads: number;
  approvedUploads: number;
  pendingUploads: number;
  studyStreak: number;
  totalApproved: number;
  totalRejected: number;
  reportsResolved: number;
  uptime: string;
}

function calculateStreak(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem("sh_visit");
    if (!raw) return 1;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const today = new Date();
      let streak = 0;
      let checkDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const format = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const dateSet = new Set(parsed);
      if (!dateSet.has(format(checkDate))) {
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (dateSet.has(format(checkDate))) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      return Math.max(streak, 1);
    }
    if (typeof parsed === "number") return parsed;
    return 1;
  } catch {
    return 1;
  }
}

export default function StudentProfilePage() {
  const router = useRouter();
  const { user, profile, loading, isLoggedIn, fetchProfile } = useAuth();
  const [supabase] = useState(() => createClient());

  const isAdmin = profile?.role === "admin";

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [college, setCollege] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Stats State
  const [stats, setStats] = useState<UserStats>({
    totalUploads: 0,
    approvedUploads: 0,
    pendingUploads: 0,
    studyStreak: 1,
    totalApproved: 0,
    totalRejected: 0,
    reportsResolved: 0,
    uptime: "99.9%",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setRollNumber(profile.roll_number || "");
      setCollege(profile.college || "");
    } else if (user) {
      setFullName(user.name || user.email?.split("@")[0] || "");
    }
  }, [profile, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/?auth=login");
    }
  }, [loading, isLoggedIn, router]);

  // Fetch statistics from Supabase based on role
  const loadStats = useCallback(async (userId: string, isUserAdmin: boolean) => {
    setLoadingStats(true);
    try {
      if (isUserAdmin) {
        const [
          { count: approvedCount },
          { count: rejectedCount },
          { count: resolvedReportsCount },
        ] = await Promise.all([
          supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("status", "APPROVED"),
          supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("status", "REJECTED"),
          supabase
            .from("reports")
            .select("*", { count: "exact", head: true })
            .neq("status", "OPEN"),
        ]);

        setStats({
          totalUploads: 0,
          approvedUploads: 0,
          pendingUploads: 0,
          studyStreak: 1,
          totalApproved: approvedCount || 0,
          totalRejected: rejectedCount || 0,
          reportsResolved: resolvedReportsCount || 0,
          uptime: "99.9%",
        });
      } else {
        const [
          { count: totalCount },
          { count: approvedCount },
          { count: pendingCount },
        ] = await Promise.all([
          supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("uploaded_by", userId),
          supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("uploaded_by", userId)
            .eq("status", "APPROVED"),
          supabase
            .from("resources")
            .select("*", { count: "exact", head: true })
            .eq("uploaded_by", userId)
            .eq("status", "PENDING"),
        ]);

        const streak = calculateStreak();

        setStats({
          totalUploads: totalCount || 0,
          approvedUploads: approvedCount || 0,
          pendingUploads: pendingCount || 0,
          studyStreak: streak,
          totalApproved: 0,
          totalRejected: 0,
          reportsResolved: 0,
          uptime: "99.9%",
        });
      }
    } catch (err) {
      console.error("Error loading user stats:", err);
    } finally {
      setLoadingStats(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      loadStats(user.id, isAdmin);
    }
  }, [user?.id, isAdmin, loadStats]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrorMsg("");
    setSuccessMsg("");
    setIsSaving(true);

    try {
      const updatePayload: {
        full_name: string;
        roll_number?: string | null;
        college?: string | null;
      } = {
        full_name: fullName.trim(),
      };

      if (!isAdmin) {
        updatePayload.roll_number = rollNumber.trim() || null;
        updatePayload.college = college.trim() || null;
      }

      const { error } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

      if (error) {
        setErrorMsg(error.message || "Failed to update profile.");
      } else {
        await fetchProfile(user.id);
        setSuccessMsg("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.full_name || "");
      setRollNumber(profile.roll_number || "");
      setCollege(profile.college || "");
    }
    setErrorMsg("");
    setIsEditing(false);
  };

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyber-blue" />
      </div>
    );
  }

  const displayName =
    profile?.full_name ||
    user.name ||
    user.email?.split("@")[0] ||
    "Student";

  const initial = displayName.charAt(0).toUpperCase();

  const formattedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "September 2026";

  const role = isAdmin ? "Admin" : "Student";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3 py-1 text-xs font-bold text-cyber-blue">
            <span>👤</span>
            <span>StudentHub Account</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isAdmin
              ? "Manage your administrator profile details and platform moderation metrics."
              : "Manage your personal academic details, university credentials, and contribution metrics."}
          </p>
        </div>

        <Link
          href={isAdmin ? "/admin" : "/dashboard"}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#090d16] px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-cyber-blue hover:border-cyber-blue/30 transition-all shadow-sm self-start sm:self-auto"
        >
          <span>←</span>
          <span>{isAdmin ? "Back to Admin Panel" : "Back to Dashboard"}</span>
        </Link>
      </div>

      {/* Global Feedback Banners */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-sm text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 animate-fadeIn">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-sm text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2 animate-fadeIn">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* TOP SECTION — Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          {/* Avatar + Primary Details */}
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-tr from-cyber-blue to-cyber-indigo text-white font-extrabold text-3xl sm:text-4xl flex items-center justify-center shadow-lg shadow-cyber-blue/20 ring-4 ring-white/50 dark:ring-white/10 shrink-0">
              {initial}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  {displayName}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border ${
                    isAdmin
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400"
                      : "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isAdmin ? "bg-rose-500" : "bg-cyber-blue"}`} />
                  {role}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {user.email}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-500">
                {isAdmin ? (
                  <>Admin since <span className="font-semibold text-slate-700 dark:text-slate-300">{formattedDate !== "Recent Member" ? formattedDate : "September 2026"}</span></>
                ) : (
                  <>Member since <span className="font-semibold text-slate-700 dark:text-slate-300">{formattedDate}</span></>
                )}
              </p>
            </div>
          </div>

          {/* Edit Profile Button */}
          {!isEditing && (
            <button
              onClick={() => {
                setIsEditing(true);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5 self-stretch sm:self-auto justify-center"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* EDIT MODE FORM */}
        {isEditing ? (
          <form onSubmit={handleSave} className="pt-6 border-t border-slate-200/80 dark:border-white/5 space-y-5 animate-fadeIn">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Edit Account Information
            </h3>

            <div className={`grid grid-cols-1 ${isAdmin ? "" : "sm:grid-cols-2"} gap-4`}>
              <div className={`space-y-1.5 ${isAdmin ? "" : "sm:col-span-2"}`}>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Satyveer Yadav"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                />
              </div>

              {!isAdmin && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      University Roll Number
                    </label>
                    <input
                      type="text"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g. 2100970100099"
                      className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      College / Institute
                    </label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. SMS Institute of Technology, Lucknow"
                      className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-xl bg-cyber-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* READ ONLY DETAILS */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200/80 dark:border-white/5">
            {isAdmin ? (
              <>
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Admin Since
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formattedDate !== "Recent Member" ? formattedDate : "September 2026"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Platform Role
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Content Moderator
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Roll Number
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {profile?.roll_number || "Not provided"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    College / Institute
                  </span>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {profile?.college || "Dr. A.P.J. Abdul Kalam Technical University (AKTU)"}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* BOTTOM SECTION — Stats Cards (read-only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? "Moderation Activity" : "Academic & Contribution Metrics"}
          </h2>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Real-time activity
          </span>
        </div>

        {isAdmin ? (
          /* Admin Stats Cards */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Approved */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-emerald-500/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">✅</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Approved
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {loadingStats ? "..." : stats.totalApproved}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Approved
                </p>
              </div>
            </div>

            {/* Total Rejected */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-rose-500/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">❌</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                  Rejected
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                  {loadingStats ? "..." : stats.totalRejected}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Rejected
                </p>
              </div>
            </div>

            {/* Total Reports Resolved */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-cyber-blue/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🛡️</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                  Resolved
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-cyber-blue">
                  {loadingStats ? "..." : stats.reportsResolved}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Reports Resolved
                </p>
              </div>
            </div>

            {/* Platform Uptime */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Status
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {stats.uptime}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Platform Uptime
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Student Stats Cards */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Uploads */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📤</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                  Uploads
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {loadingStats ? "..." : stats.totalUploads}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Uploads
                </p>
              </div>
            </div>

            {/* Approved Uploads */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-emerald-500/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">✅</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Verified
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {loadingStats ? "..." : stats.approvedUploads}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Approved Uploads
                </p>
              </div>
            </div>

            {/* Pending Uploads */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-amber-500/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">⏳</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                  Queue
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  {loadingStats ? "..." : stats.pendingUploads}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Pending Uploads
                </p>
              </div>
            </div>

            {/* Study Streak */}
            <div className="glass-panel p-5 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-orange-500/20 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded">
                  Streak
                </span>
              </div>
              <div className="mt-4 space-y-0.5">
                <p className="text-2xl sm:text-3xl font-extrabold text-orange-500">
                  {stats.studyStreak} {stats.studyStreak === 1 ? "Day" : "Days"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Study Attendance
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
