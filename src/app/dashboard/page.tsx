"use client";

import { FormEvent, useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { generateDefaultChecklist, ChecklistItem as SubjectChecklistItem } from "@/lib/subjects";
import { createClient } from "@/lib/supabase/client";

type PomodoroMode = "focus" | "break";

interface PomodoroState {
  mode: PomodoroMode;
  secondsLeft: number;
  sessions: number;
  isRunning: boolean;
}

interface StudyTask {
  id: string;
  text: string;
  done: boolean;
  createdAt: number;
}

interface FocusState {
  name: string;
  progress: number;
}

interface SavedCalculation {
  id: string;
  type: string;
  score: number;
  date: string;
}

interface Bookmark {
  id: string;
  title: string;
  subjectName: string;
  url: string;
  unit?: string;
  type?: string;
}

export interface MyUploadResource {
  id: string;
  title: string;
  type: string;
  semester?: number | null;
  subject_slug?: string | null;
  unit_number?: number | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejection_reason?: string | null;
  created_at: string;
}

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const PANEL_CLASS =
  "glass-panel rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-[#090d16]/90 p-6 shadow-xl shadow-slate-950/5 dark:shadow-black/20 backdrop-blur-xl transition-all duration-300";

const LABEL_CLASS =
  "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400";

const POPULAR_SUBJECTS = [
  "Data Structures",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Compiler Design",
  "Design & Analysis of Algorithms",
  "Theory of Automata",
  "Discrete Mathematics",
  "Machine Learning",
  "Engineering Physics",
  "Engineering Mathematics-I",
];

// Recommended resources based on actual available materials in StudentHub
const CURATED_RECOMMENDED_RESOURCES = [
  {
    title: "Engineering Chemistry Complete Unit 1-5 Handwritten Notes",
    subject: "Engineering Chemistry",
    code: "BAS102",
    unit: "1-5",
    type: "Notes",
    url: "/notes/sem-1/engineering-chemistry",
    badge: "Verified PDF",
  },
  {
    title: "Data Structures & Algorithms Comprehensive Revision Sheet",
    subject: "Data Structures",
    code: "BCS301",
    unit: "1-5",
    type: "Notes",
    url: "/notes/sem-3/data-structures",
    badge: "Popular",
  },
  {
    title: "Computer Organization & Architecture ALU & Pipelining Notes",
    subject: "Computer Organization",
    code: "BCS302",
    unit: "1",
    type: "Notes",
    url: "/notes/sem-3/computer-organization-architecture",
    badge: "Core Unit",
  },
  {
    title: "Operating Systems CPU Scheduling & Deadlock Solved Papers",
    subject: "Operating Systems",
    code: "BCS401",
    unit: "1-2",
    type: "PYQ",
    url: "/pyq/sem-4/operating-systems",
    badge: "Exam PYQ",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Graceful fallback
  }
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function localDateString(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function WidgetSkeleton({ className = "h-48" }: { className?: string }) {
  return (
    <div className={`${PANEL_CLASS} ${className} animate-pulse flex flex-col justify-between`}>
      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/3" />
      <div className="h-8 bg-slate-200 dark:bg-white/5 rounded-xl w-3/4" />
      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
    </div>
  );
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, profile, isAdmin, isLoggedIn, loading, openAuthModal, signOut } = useAuth();
  const [supabase] = useState(() => createClient());
  const [isMounted, setIsMounted] = useState(false);

  // Admin routing check: if logged in as admin, redirect to /admin
  useEffect(() => {
    if (!loading && isLoggedIn && (isAdmin || profile?.role === "admin")) {
      router.replace("/admin");
    }
  }, [loading, isLoggedIn, isAdmin, profile, router]);

  // Core Persistent State Hooks
  const [myUploads, setMyUploads] = useState<MyUploadResource[]>([]);
  const [focus, setFocus] = useState<FocusState>({ name: "", progress: 0 });
  const [customSubject, setCustomSubject] = useState("");
  const [tasks, setTasks] = useState<StudyTask[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [checklist, setChecklist] = useState<SubjectChecklistItem[]>([]);
  const [semesterFilter, setSemesterFilter] = useState("Sem 3");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [visitLog, setVisitLog] = useState<string[]>([]);
  const [pomo, setPomo] = useState<PomodoroState>({
    mode: "focus",
    secondsLeft: FOCUS_DURATION,
    sessions: 0,
    isRunning: false,
  });

  const focusToolsRef = useRef<HTMLDivElement>(null);
  const hasLoadedFromCloud = useRef(false);

  // Hydration Load & Merging with Full AKTU Curriculum
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFocus(readStorage<FocusState>("sh_focus", { name: "Data Structures", progress: 65 }));
      setTasks(
        readStorage<StudyTask[]>("sh_tasks", [
          { id: "task-dsa-trees", text: "Revise Binary Search Trees & AVL Trees", done: false, createdAt: 1 },
          { id: "task-os-deadlock", text: "Practice Deadlock & Bankers Algorithm", done: true, createdAt: 2 },
          { id: "task-pyq-2024", text: "Solve 2024 End-Sem AKTU Question Paper", done: false, createdAt: 3 },
        ])
      );

      // Generate complete checklist covering all 65 subjects across Sem 1-8
      const defaultFullChecklist = generateDefaultChecklist();
      const savedChecklist = readStorage<SubjectChecklistItem[]>("sh_checklist", []);

      if (savedChecklist.length > 0) {
        // Merge saved checked status with complete curriculum list
        const mergedChecklist = defaultFullChecklist.map((item) => {
          const matched = savedChecklist.find(
            (s) => s.id === item.id || (s.subject === item.subject && s.semester === item.semester)
          );
          return matched ? { ...item, done: matched.done } : item;
        });
        setChecklist(mergedChecklist);
      } else {
        setChecklist(defaultFullChecklist);
      }

      setBookmarks(readStorage<Bookmark[]>("studenthub_bookmarks", []));
      setCalculations(readStorage<SavedCalculation[]>("studenthub_saved_calc", []));

      // Study streak attendance tracking
      const todayStr = localDateString(new Date());
      const currentVisits = readStorage<string[]>("sh_visit", []);
      const nextVisits = currentVisits.includes(todayStr) ? currentVisits : [...currentVisits, todayStr];
      setVisitLog(nextVisits);
      writeStorage("sh_visit", nextVisits);

      // Pomodoro state
      const savedPomo = readStorage<PomodoroState>("sh_pomo", {
        mode: "focus",
        secondsLeft: FOCUS_DURATION,
        sessions: 0,
        isRunning: false,
      });
      setPomo({ ...savedPomo, isRunning: false });

      setIsMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Fetch and Sync with Supabase on mount / login
  const fetchCloudData = useCallback(async (userId: string) => {
    try {
      // 1. Fetch dashboard_data
      const { data: cloudDashboard } = await supabase
        .from("dashboard_data")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (cloudDashboard) {
        if (Array.isArray(cloudDashboard.tasks) && cloudDashboard.tasks.length > 0) {
          setTasks(cloudDashboard.tasks);
        }
        if (Array.isArray(cloudDashboard.checklist) && cloudDashboard.checklist.length > 0) {
          setChecklist(cloudDashboard.checklist);
        }
        if (cloudDashboard.focus_subject) {
          setFocus({
            name: cloudDashboard.focus_subject,
            progress: cloudDashboard.focus_progress ?? 0,
          });
        }
      }

      // 2. Fetch Grade History
      const { data: userGrades } = await supabase
        .from("grade_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (userGrades && userGrades.length > 0) {
        const mappedGrades: SavedCalculation[] = userGrades.map((g) => ({
          id: g.id,
          type: g.type,
          score: Number(g.score),
          date: new Date(g.created_at).toLocaleDateString(),
        }));
        setCalculations(mappedGrades);
      }

      // 3. Fetch Bookmarks from Supabase bookmarks table (join with resources)
      const { data: userBookmarks } = await supabase
        .from("bookmarks")
        .select("id, resource_id, resources(id, title, type, subject_slug, unit_number, semester, file_url)")
        .eq("user_id", userId);

      if (userBookmarks && userBookmarks.length > 0) {
        const mappedBookmarks: Bookmark[] = userBookmarks.map((b: any) => {
          const res = Array.isArray(b.resources) ? b.resources[0] : b.resources;
          return {
            id: b.id,
            title: res?.title || "Resource",
            subjectName: res?.subject_slug || "Subject",
            url: res?.file_url || (res?.subject_slug ? `/notes/sem-${res.semester || 1}/${res.subject_slug}` : "/notes"),
            unit: res?.unit_number ? String(res.unit_number) : undefined,
            type: res?.type,
          };
        });
        setBookmarks(mappedBookmarks);
      }

      // 4. Fetch User's Uploaded Resources
      const { data: userUploads } = await supabase
        .from("resources")
        .select("id, title, type, semester, subject_slug, unit_number, status, rejection_reason, created_at")
        .eq("uploaded_by", userId)
        .order("created_at", { ascending: false });

      if (userUploads) {
        setMyUploads(userUploads as MyUploadResource[]);
      }

      hasLoadedFromCloud.current = true;
    } catch (err) {
      console.error("Failed to sync cloud dashboard data:", err);
    }
  }, [supabase]);

  useEffect(() => {
    if (isMounted && user?.id) {
      fetchCloudData(user.id);
    }
  }, [isMounted, user?.id, fetchCloudData]);

  // Debounced cloud sync (2 seconds) to dashboard_data table
  useEffect(() => {
    if (!isMounted || !user?.id) return;

    const timer = setTimeout(async () => {
      try {
        await supabase.from("dashboard_data").upsert({
          user_id: user.id,
          focus_subject: focus.name || null,
          focus_progress: focus.progress || 0,
          tasks: tasks,
          checklist: checklist,
          visit_log: visitLog,
          pomo_sessions: pomo.sessions,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Auto-sync error:", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [focus, tasks, checklist, visitLog, pomo.sessions, user?.id, isMounted, supabase]);

  // Save changes to LocalStorage
  useEffect(() => {
    if (isMounted) writeStorage("sh_focus", focus);
  }, [focus, isMounted]);

  useEffect(() => {
    if (isMounted) writeStorage("sh_tasks", tasks);
  }, [tasks, isMounted]);

  useEffect(() => {
    if (isMounted && checklist.length > 0) writeStorage("sh_checklist", checklist);
  }, [checklist, isMounted]);

  useEffect(() => {
    if (isMounted) writeStorage("studenthub_bookmarks", bookmarks);
  }, [bookmarks, isMounted]);

  useEffect(() => {
    if (isMounted) writeStorage("studenthub_saved_calc", calculations);
  }, [calculations, isMounted]);

  useEffect(() => {
    if (isMounted) writeStorage("sh_pomo", pomo);
  }, [pomo, isMounted]);

  // Pomodoro Interval Timer
  useEffect(() => {
    if (!isMounted || !pomo.isRunning) return;
    const interval = window.setInterval(() => {
      setPomo((current) => {
        if (current.secondsLeft > 1) {
          return { ...current, secondsLeft: current.secondsLeft - 1 };
        }
        if (current.mode === "focus") {
          return {
            ...current,
            mode: "break",
            secondsLeft: BREAK_DURATION,
            sessions: current.sessions + 1,
          };
        }
        return {
          ...current,
          mode: "focus",
          secondsLeft: FOCUS_DURATION,
        };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isMounted, pomo.isRunning]);

  // Streak calculation
  const today = new Date();
  let streakCount = 0;
  const cursorDate = new Date(today);
  while (visitLog.includes(localDateString(cursorDate))) {
    streakCount += 1;
    cursorDate.setDate(cursorDate.getDate() - 1);
  }
  const streakEmoji = streakCount >= 30 ? "🏆" : streakCount >= 7 ? "⚡" : streakCount >= 3 ? "🔥" : "📅";

  // Syllabus calculation
  const totalChecklistItems = checklist.length;
  const completedChecklistItems = checklist.filter((item) => item.done).length;
  const overallSyllabusPercent = totalChecklistItems
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
    : 0;

  const currentSemItems =
    semesterFilter === "All"
      ? checklist
      : checklist.filter((item) => item.semester === semesterFilter);
  const currentSemCompleted = currentSemItems.filter((i) => i.done).length;
  const currentSemPercent = currentSemItems.length
    ? Math.round((currentSemCompleted / currentSemItems.length) * 100)
    : 0;

  // Task Actions
  const handleAddTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;
    setTasks((curr) => [
      ...curr,
      {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        text,
        done: false,
        createdAt: Date.now(),
      },
    ]);
    setNewTaskText("");
  };

  const toggleTask = (id: string) => {
    setTasks((curr) => curr.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((curr) => curr.filter((t) => t.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks((curr) => curr.filter((t) => !t.done));
  };

  const completedTasksCount = tasks.filter((t) => t.done).length;
  const tasksPercent = tasks.length ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  // Bookmark Actions
  const removeBookmark = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarks((curr) => curr.filter((b) => b.id !== id));
    if (user?.id) {
      try {
        await supabase.from("bookmarks").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete cloud bookmark:", err);
      }
    }
  };

  // Grade History Actions
  const deleteCalculation = async (id: string) => {
    setCalculations((curr) => curr.filter((c) => c.id !== id));
    if (user?.id) {
      try {
        await supabase.from("grade_history").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete cloud grade record:", err);
      }
    }
  };

  // Start Focus Session Handler (connects FocusWidget to Pomodoro)
  const handleStartFocusSession = () => {
    setPomo((curr) => ({
      ...curr,
      mode: "focus",
      secondsLeft: FOCUS_DURATION,
      isRunning: true,
    }));
    focusToolsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const welcomeName = isMounted && isLoggedIn && user ? (user.name || "Student") : "Student";
  const userBranch = isMounted && isLoggedIn && user?.branch ? user.branch : "Computer Science & Engineering";

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-14 bg-slate-200 dark:bg-white/5 rounded-2xl w-1/2" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <WidgetSkeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <WidgetSkeleton className="h-72" />
          <WidgetSkeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (isLoggedIn && (isAdmin || profile?.role === "admin")) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Redirecting to Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      
      {/* ========================================================================= */}
      {/* 1. TOP WELCOME & ACADEMIC HEADER */}
      {/* ========================================================================= */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-b border-slate-200/80 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3.5 py-1 text-xs font-bold text-cyber-blue">
            <span className="h-1.5 w-1.5 rounded-full bg-cyber-blue animate-pulse" />
            StudentHub Command Center • AKTU Edition
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
              {welcomeName}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {userBranch}
            </span>
            <span>•</span>
            {isLoggedIn ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>●</span> Synced to cloud ☁️
              </span>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="text-cyber-blue hover:underline font-semibold"
              >
                Complete your profile →
              </button>
            )}
          </div>
        </div>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-indigo px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:opacity-95 transition-all"
              >
                Create Account
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                👤 {user?.name || "Student"}
              </span>
              <button
                type="button"
                onClick={signOut}
                className="rounded-xl border border-slate-200 dark:border-white/10 px-3.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 hover:border-rose-400/40 transition-all"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 1.5. MY UPLOADS SECTION (CHANGE 4) */}
      {/* ========================================================================= */}
      <section className={`${PANEL_CLASS} space-y-6`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/5 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📤</span>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                My Uploads
              </h2>
              <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/10 px-2.5 py-0.5 rounded-full border border-cyber-blue/20">
                {myUploads.length} {myUploads.length === 1 ? "Upload" : "Uploads"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track the moderation and publication status of your contributed study resources.
            </p>
          </div>

          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-indigo px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:opacity-95 transition-all w-full sm:w-auto hover:-translate-y-0.5"
          >
            <span>+</span>
            <span>Upload Notes/PYQ</span>
          </Link>
        </div>

        {myUploads.length === 0 ? (
          <div className="text-center py-8 bg-slate-50/50 dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/5 rounded-2xl space-y-3">
            <span className="text-2xl">📚</span>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No resources uploaded yet</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Help other AKTU students by uploading verified lecture notes, handwritten formulas, or previous year papers.
              </p>
            </div>
            <Link
              href="/dashboard/upload"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyber-blue hover:underline"
            >
              <span>Upload your first document →</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 px-3">Title & Type</th>
                  <th className="py-2.5 px-3">Subject / Semester</th>
                  <th className="py-2.5 px-3">Upload Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-white/5 text-xs">
                {myUploads.map((upload) => (
                  <tr key={upload.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20">
                          {upload.type}
                        </span>
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {upload.title}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{upload.subject_slug || "General"}</div>
                      <div className="text-[10px] text-slate-500">{upload.semester ? `Semester ${upload.semester}` : "N/A"}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(upload.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {upload.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">
                          <span>⏳</span> Pending
                        </span>
                      )}
                      {upload.status === "APPROVED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                          <span>✅</span> Approved
                        </span>
                      )}
                      {upload.status === "REJECTED" && (
                        <div className="inline-flex flex-col items-end gap-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25">
                            <span>❌</span> Rejected
                          </span>
                          {upload.rejection_reason && (
                            <span className="text-[10px] text-rose-500 dark:text-rose-400 max-w-xs text-right italic">
                              Reason: {upload.rejection_reason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. ACADEMIC OVERVIEW (4 STAT CARDS) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Syllabus Progress */}
        <div className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/30`}>
          <div className="flex items-center justify-between">
            <span className="text-xl">📚</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
              Curriculum
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {overallSyllabusPercent}%
            </div>
            <p className={LABEL_CLASS}>Syllabus Progress</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              {completedChecklistItems} of {totalChecklistItems} subjects checked
            </p>
          </div>
        </div>

        {/* Card 2: Saved Resources */}
        <div className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/30`}>
          <div className="flex items-center justify-between">
            <span className="text-xl">🔖</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
              Vault
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {bookmarks.length}
            </div>
            <p className={LABEL_CLASS}>Saved Resources</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Notes & PYQs in study vault
            </p>
          </div>
        </div>

        {/* Card 3: Study Streak */}
        <div className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/30`}>
          <div className="flex items-center justify-between">
            <span className="text-xl">{streakEmoji}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              Streak
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {streakCount} {streakCount === 1 ? "Day" : "Days"}
            </div>
            <p className={LABEL_CLASS}>Study Streak</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Daily learning consistency
            </p>
          </div>
        </div>

        {/* Card 4: Study Sessions */}
        <div className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/30`}>
          <div className="flex items-center justify-between">
            <span className="text-xl">🧠</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              Sessions
            </span>
          </div>
          <div className="mt-3">
            <div className="font-heading text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {pomo.sessions}
            </div>
            <p className={LABEL_CLASS}>Deep Work Rounds</p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Completed 25m focus blocks
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TODAY'S FOCUS & CONTINUE LEARNING (2 COLUMNS) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 cols): Today's Focus Subject */}
        <div className={`${PANEL_CLASS} lg:col-span-7 flex flex-col justify-between space-y-6`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
              <div>
                <p className={LABEL_CLASS}>Target for Today</p>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Today&apos;s Focus Subject
                </h2>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  focus.progress === 100
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : focus.name
                    ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20"
                    : "bg-slate-100 dark:bg-white/5 text-slate-400 border border-slate-200 dark:border-white/10"
                }`}
              >
                {focus.progress === 100
                  ? "🎉 Mastered"
                  : focus.name
                  ? `${focus.progress}% Progress`
                  : "Not Set"}
              </span>
            </div>

            {focus.name ? (
              <div className="mt-5 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-cyber-blue">Active Target Subject</span>
                    <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white mt-0.5">
                      {focus.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFocus({ name: "", progress: 0 })}
                    className="text-xs font-bold text-slate-500 hover:text-cyber-blue border border-slate-200 dark:border-white/10 px-3 py-1 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                  >
                    Change Subject
                  </button>
                </div>

                {/* Interactive Progress Slider */}
                <div className="space-y-2 bg-slate-50/80 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Preparation & Revision Level</span>
                    <span className="text-cyber-blue font-black text-sm">{focus.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={focus.progress}
                    onChange={(e) => setFocus((curr) => ({ ...curr, progress: Number(e.target.value) }))}
                    className="w-full accent-cyber-blue cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-medium pt-1">
                    <span>0% (Starting)</span>
                    <span>50% (Concepts & Notes)</span>
                    <span>100% (PYQs & Exam Ready)</span>
                  </div>
                </div>

                {focus.progress === 100 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <span>🎉</span>
                    <span>Goal achieved! You&apos;ve completed today&apos;s revision for {focus.name}.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Select a subject you want to dedicate focus to today:
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUBJECTS.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setFocus({ name: sub, progress: 20 })}
                      className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-cyber-blue/40 hover:text-cyber-blue transition-all"
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (customSubject.trim()) {
                      setFocus({ name: customSubject.trim(), progress: 10 });
                      setCustomSubject("");
                    }
                  }}
                  className="flex gap-2 pt-2"
                >
                  <input
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Or type a custom subject code/name..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2 text-xs outline-none focus:border-cyber-blue/50 text-slate-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-cyber-blue px-4 py-2 text-xs font-bold text-white hover:bg-cyber-indigo transition-all"
                  >
                    Set Focus
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Primary Action Button: Connect to Pomodoro */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Ready for a distraction-free study sprint?
            </div>
            <button
              type="button"
              onClick={handleStartFocusSession}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-indigo px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:opacity-95 transition-all"
            >
              <span>⏱️</span>
              <span>Start 25-Min Focus Session →</span>
            </button>
          </div>
        </div>

        {/* RIGHT (5 cols): Continue Learning */}
        <div className={`${PANEL_CLASS} lg:col-span-5 flex flex-col justify-between space-y-4`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
              <div>
                <p className={LABEL_CLASS}>Active Vault</p>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Continue Learning
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-500">
                {bookmarks.length} Saved
              </span>
            </div>

            {bookmarks.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyber-blue/10 text-2xl">
                  📚
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200">
                    No resources in your learning vault yet.
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Bookmark unit notes and previous year papers across the portal to quickly resume your preparation here.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <Link
                    href="/notes"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyber-blue hover:text-cyber-indigo bg-cyber-blue/10 px-3 py-1.5 rounded-xl border border-cyber-blue/20"
                  >
                    <span>Explore Semester Notes</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/pyq"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyber-indigo hover:text-cyber-blue bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20"
                  >
                    <span>Browse All PYQs</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2.5">
                {bookmarks.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/50 p-3 hover:border-cyber-blue/40 transition-all"
                  >
                    <Link href={item.url} className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                          {item.subjectName || "Subject"}
                        </span>
                        {item.unit && (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            Unit {item.unit}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 font-heading text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-cyber-blue transition-colors">
                        {item.title}
                      </div>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-cyber-blue">
                        Open Resource <span>→</span>
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => removeBookmark(item.id, e)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                      title="Remove from saved"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need question papers?</span>
            <Link href="/pyq" className="font-bold text-cyber-indigo hover:underline">
              Browse All PYQs →
            </Link>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 4. SYLLABUS PROGRESS & STUDY TASKS (2 COLUMNS) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (7 cols): Syllabus Progress Tracker */}
        <div className={`${PANEL_CLASS} lg:col-span-7 space-y-5`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 dark:border-white/5 pb-3">
            <div>
              <p className={LABEL_CLASS}>Academic Coverage</p>
              <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                Syllabus Progress Tracker
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Semester Coverage:</span>
              <span className="font-heading text-base font-black text-cyber-blue">
                {currentSemPercent}%
              </span>
            </div>
          </div>

          {/* Semester Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["All", "Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"].map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => setSemesterFilter(sem)}
                className={`shrink-0 rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  semesterFilter === sem
                    ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
                }`}
              >
                {sem}
              </button>
            ))}
          </div>

          {/* Overall Semester Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyber-blue to-cyber-indigo transition-all duration-500"
                style={{ width: `${currentSemPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
              <span>{currentSemCompleted} of {currentSemItems.length} subjects completed</span>
              <span>{currentSemPercent}% Covered</span>
            </div>
          </div>

          {/* Subject by Subject List */}
          <div className="grid gap-2.5 sm:grid-cols-2 pt-2 max-h-72 overflow-y-auto pr-1">
            {currentSemItems.map((item) => {
              const semKey = item.id.split("-").slice(0, 2).join("-");
              const subSlug = item.id.split("-").slice(2).join("-");

              return (
                <div
                  key={item.id}
                  className="flex flex-col justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/40 hover:border-cyber-blue/30 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() =>
                          setChecklist((curr) =>
                            curr.map((entry) => (entry.id === item.id ? { ...entry, done: !entry.done } : entry))
                          )
                        }
                        aria-label={`Mark ${item.subject} as completed`}
                        className="h-4 w-4 rounded accent-cyber-blue cursor-pointer mt-0.5"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/notes/${semKey}/${subSlug}`}
                          className={`block truncate text-xs font-bold hover:text-cyber-blue transition-colors ${
                            item.done ? "text-slate-400 line-through" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {item.subject}
                        </Link>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          {item.code && <span className="font-mono">{item.code}</span>}
                          <span>•</span>
                          <span>{item.semester}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                        item.done
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-slate-200 dark:bg-white/5 text-slate-500"
                      }`}
                    >
                      {item.done ? "100%" : "0%"}
                    </span>
                  </div>

                  {/* Visual Subject Progress Bar */}
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        item.done ? "bg-emerald-500 w-full" : "bg-slate-300 dark:bg-slate-700 w-0"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT (5 cols): Daily Study Tasks */}
        <div className={`${PANEL_CLASS} lg:col-span-5 space-y-4 flex flex-col justify-between`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
              <div>
                <p className={LABEL_CLASS}>Daily Checklist</p>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  Study Tasks
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-500">
                {completedTasksCount}/{tasks.length} Done
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${tasksPercent}%` }}
              />
            </div>

            {/* Quick Add Task Form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add a study task or revision topic..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/60 px-3.5 py-2 text-xs outline-none focus:border-cyber-blue/50 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                className="rounded-xl bg-cyber-blue px-3.5 py-2 text-xs font-bold text-white hover:bg-cyber-indigo transition-all"
              >
                Add
              </button>
            </form>

            {/* Tasks list */}
            {tasks.length === 0 ? (
              <div className="py-8 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">You&apos;re all caught up 🎉</p>
                <p className="text-[11px] text-slate-500">Add a subject topic or assignment above to keep your study streak active.</p>
              </div>
            ) : (
              <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                        className="h-3.5 w-3.5 rounded accent-emerald-500 cursor-pointer"
                      />
                      <span
                        className={`truncate text-xs ${
                          task.done
                            ? "text-slate-400 line-through dark:text-slate-500"
                            : "text-slate-700 dark:text-slate-200 font-medium"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {completedTasksCount > 0 && (
            <div className="pt-2 border-t border-slate-200/80 dark:border-white/5 flex justify-end">
              <button
                type="button"
                onClick={clearCompletedTasks}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-500 transition-colors"
              >
                Clear Completed Tasks ({completedTasksCount})
              </button>
            </div>
          )}
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 5. RECOMMENDED RESOURCES / ACADEMIC DISCOVERY */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className={LABEL_CLASS}>Curated Materials</p>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Recommended for You
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Handwritten notes & high-weightage question papers from active curriculum
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CURATED_RECOMMENDED_RESOURCES.map((item, idx) => (
            <Link
              key={idx}
              href={item.url}
              className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/40 group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {item.badge}
                  </span>
                </div>
                
                <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.subject} • Unit {item.unit}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs font-bold text-cyber-blue">
                <span>Open Material</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. GRADE HISTORY & PYQ INSIGHTS (2 COLUMNS) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT (6 cols): Grade History */}
        <div className={`${PANEL_CLASS} lg:col-span-6 space-y-4 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span>📈</span>
                <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  Grade History (SGPA / CGPA)
                </h2>
              </div>
              <Link href="/calculator" className="text-xs font-bold text-cyber-blue hover:underline">
                Calculator →
              </Link>
            </div>

            {calculations.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-slate-500">No grade calculations saved yet.</p>
                <p className="text-[11px] text-slate-400">
                  Calculate your semester SGPA or cumulative CGPA with our official AKTU 10-point calculator.
                </p>
                <div className="pt-2">
                  <Link
                    href="/calculator"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-3.5 py-1.5 rounded-xl hover:bg-cyber-blue hover:text-white transition-all"
                  >
                    <span>Calculate & Save</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="mt-3 space-y-2">
                {calculations.slice(0, 3).map((calc) => (
                  <li
                    key={calc.id}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-slate-900/40 text-xs"
                  >
                    <div>
                      <span className="font-bold text-cyber-blue uppercase text-[10px] tracking-wider">{calc.type} Score</span>
                      <p className="mt-0.5 text-lg font-black text-slate-900 dark:text-white">{calc.score}</p>
                      <span className="text-[10px] text-slate-400">{calc.date}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteCalculation(calc.id)}
                      className="text-slate-400 hover:text-rose-500 text-base px-2 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT (6 cols): PYQ Insights (Phase 2 Preparation) */}
        <div className={`${PANEL_CLASS} lg:col-span-6 space-y-4 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span>📑</span>
                <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                  PYQ Exam Insights
                </h2>
              </div>
              <span className="text-[10px] font-extrabold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase">
                Phase 2
              </span>
            </div>

            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-xl text-indigo-500">
                ⚡
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-slate-200">
                  AI-Powered PYQ Analysis Coming Soon
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Topic recurrence heatmaps, unit weightage breakdowns, and solved question paper clusters are in development.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/pyq"
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyber-indigo bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl hover:bg-cyber-indigo hover:text-white transition-all"
                >
                  <span>Explore PYQ Archives</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* 7. EXPLORE STUDENTHUB (ACADEMIC NAVIGATION) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className={LABEL_CLASS}>Academic Navigation</p>
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Explore StudentHub
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Direct access to all verified AKTU study materials & tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <Link
            href="/notes"
            className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-blue/50 group`}
          >
            <div className="space-y-2">
              <span className="text-2xl">📚</span>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors">
                Semester Notes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete unit-wise syllabus & notes for Sem 1–8.
              </p>
            </div>
            <span className="pt-4 text-xs font-bold text-cyber-blue group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Browse Notes <span>→</span>
            </span>
          </Link>

          <Link
            href="/pyq"
            className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-cyber-indigo/50 group`}
          >
            <div className="space-y-2">
              <span className="text-2xl">📄</span>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-cyber-indigo transition-colors">
                PYQ Archives
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Year-wise university exam papers with solved keys.
              </p>
            </div>
            <span className="pt-4 text-xs font-bold text-cyber-indigo group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Open PYQs <span>→</span>
            </span>
          </Link>


          <Link
            href="/calculator"
            className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-purple-500/50 group`}
          >
            <div className="space-y-2">
              <span className="text-2xl">🧮</span>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                AKTU Calculator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Official 10-point SGPA & CGPA grading estimator.
              </p>
            </div>
            <span className="pt-4 text-xs font-bold text-purple-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Calculate GPA <span>→</span>
            </span>
          </Link>

          <Link
            href="/resources"
            className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-emerald-500/50 group`}
          >
            <div className="space-y-2">
              <span className="text-2xl">💼</span>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                Placement Vault
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                ATS resume templates & core CS interview prep sheets.
              </p>
            </div>
            <span className="pt-4 text-xs font-bold text-emerald-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Access Vault <span>→</span>
            </span>
          </Link>

          <Link
            href="/dashboard/upload"
            className={`${PANEL_CLASS} p-5 flex flex-col justify-between hover:border-amber-500/50 group`}
          >
            <div className="space-y-2">
              <span className="text-2xl">📤</span>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                Contribute Notes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Share verified notes or exam papers with batchmates.
              </p>
            </div>
            <span className="pt-4 text-xs font-bold text-amber-500 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Upload Now <span>→</span>
            </span>
          </Link>

        </div>

      </section>

      {/* ========================================================================= */}
      {/* 8. FOCUS TOOLS (POMODORO & STUDY STREAK - COMPACT) */}
      {/* ========================================================================= */}
      <section ref={focusToolsRef} className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-white/5">
        <div>
          <p className={LABEL_CLASS}>Supporting Utilities</p>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            Focus & Habit Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pomodoro Focus Timer */}
          <div className={`${PANEL_CLASS} flex flex-col justify-between space-y-4`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Pomodoro Timer
                </h3>
                <p className="text-xs text-slate-500">25 min focus sprint • 5 min break</p>
              </div>
              <span className="rounded-full border border-cyber-blue/20 bg-cyber-blue/10 px-2.5 py-1 text-[10px] font-bold text-cyber-blue">
                {pomo.mode === "focus" ? "🧠 Focus Mode" : "☕ Break Time"}
              </span>
            </div>

            {/* Circular Timer Display */}
            <div className="relative mx-auto my-2 h-36 w-36">
              <svg viewBox="0 0 112 112" className="h-full w-full -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-200 dark:text-slate-800"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="url(#dashboardPomoGrad2)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={
                    2 * Math.PI * 48 -
                    (((pomo.mode === "focus" ? FOCUS_DURATION : BREAK_DURATION) - pomo.secondsLeft) /
                      (pomo.mode === "focus" ? FOCUS_DURATION : BREAK_DURATION)) *
                      (2 * Math.PI * 48)
                  }
                  className="transition-[stroke-dashoffset] duration-700"
                />
                <defs>
                  <linearGradient id="dashboardPomoGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-black text-slate-900 dark:text-white">
                  {formatTime(pomo.secondsLeft)}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                  {pomo.sessions} completed
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPomo((curr) => ({ ...curr, isRunning: !curr.isRunning }))}
                className="rounded-xl bg-cyber-blue px-5 py-2 text-xs font-bold text-white hover:bg-cyber-indigo transition-all shadow-md shadow-cyber-blue/20"
              >
                {pomo.isRunning ? "Pause" : "Start Focus"}
              </button>
              <button
                type="button"
                onClick={() =>
                  setPomo((curr) => ({
                    ...curr,
                    mode: "focus",
                    secondsLeft: FOCUS_DURATION,
                    isRunning: false,
                  }))
                }
                className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Study Streak Visualizer */}
          <div className={`${PANEL_CLASS} flex flex-col justify-between space-y-4`}>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  Consistency Calendar
                </h3>
                <span className="text-xs font-bold text-amber-500">{streakEmoji} Active</span>
              </div>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-heading text-4xl font-black text-slate-900 dark:text-white">
                  {streakCount}
                </span>
                <span className="pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Consecutive Days Studied
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Log in and revise daily to maintain your study rhythm before exams.
              </p>
            </div>

            {/* 7-Day Visual Attendance Timeline */}
            <div className="space-y-2 pt-2">
              <div className="flex items-end gap-2" aria-label="Last 7 days attendance">
                {Array.from({ length: 7 }, (_, idx) => {
                  const dayDate = new Date(today);
                  dayDate.setDate(today.getDate() - (6 - idx));
                  const dateKey = localDateString(dayDate);
                  const isVisited = visitLog.includes(dateKey);
                  const weekday = dayDate.toLocaleDateString("en-US", { weekday: "narrow" });

                  return (
                    <div key={dateKey} className="flex-1 flex flex-col items-center gap-1.5">
                      <span
                        title={dateKey}
                        className={`h-9 w-full rounded-xl transition-all ${
                          isVisited
                            ? "bg-gradient-to-t from-cyber-blue to-cyber-indigo shadow-md shadow-cyber-blue/30"
                            : "bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5"
                        }`}
                      />
                      <span className="text-[10px] font-bold text-slate-400">{weekday}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
