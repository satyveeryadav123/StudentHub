"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FormEvent, useEffect, useState } from "react";
import SearchBar from "@/components/modules/SearchBar";

type StudyTask = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

const initialStudyTasks: StudyTask[] = [
  { id: "starter-dsa-arrays", text: "Complete DSA Arrays", completed: false, createdAt: 1 },
  { id: "starter-cyber-security", text: "Revise Cyber Security", completed: false, createdAt: 2 },
  { id: "starter-leetcode", text: "Solve 2 LeetCode Problems", completed: false, createdAt: 3 },
];

const studyTasksStorageKey = "studenthub-study-tasks";

const statItems = [
  { label: "Semester Notes", value: "1-8" },
  { label: "PYQs Covered", value: "1500+" },
  { label: "CGPA Tools", value: "24/7" },
];

const valuePillars = [
  {
    icon: "📘",
    title: "Notes that actually help",
    text: "Semester-wise handwritten resources, important questions, and revision-ready study material in one place.",
  },
  {
    icon: "📝",
    title: "PYQs without the chaos",
    text: "Find previous year papers by subject and semester quickly, so exam prep becomes faster and smarter.",
  },
  {
    icon: "⚡",
    title: "Everything built for speed",
    text: "Search smarter, calculate faster, and keep your academic routine organized with a student-first dashboard.",
  },
];

export default function Home() {
  const reduceMotion = useReducedMotion();
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(initialStudyTasks);
  const [isTaskInputOpen, setIsTaskInputOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storedTasks = window.localStorage.getItem(studyTasksStorageKey);
        if (storedTasks) {
          const parsedTasks: unknown = JSON.parse(storedTasks);
          if (Array.isArray(parsedTasks)) {
            const validTasks = parsedTasks.filter(
              (task): task is StudyTask =>
                typeof task === "object" &&
                task !== null &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean" &&
                typeof task.createdAt === "number",
            );
            setStudyTasks(validTasks);
          }
        }
      } catch {
        // Keep the starter tasks if localStorage is unavailable or corrupted.
      } finally {
        setHasLoadedTasks(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hasLoadedTasks) return;

    try {
      window.localStorage.setItem(studyTasksStorageKey, JSON.stringify(studyTasks));
    } catch {
      // The widget remains usable when storage is blocked or full.
    }
  }, [hasLoadedTasks, studyTasks]);

  const sortedStudyTasks = [...studyTasks].sort(
    (firstTask, secondTask) => Number(firstTask.completed) - Number(secondTask.completed) || firstTask.createdAt - secondTask.createdAt,
  );
  const completedTaskCount = studyTasks.filter((task) => task.completed).length;
  const taskProgress = studyTasks.length ? (completedTaskCount / studyTasks.length) * 100 : 0;

  function addStudyTask(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const text = newTaskText.trim();
    if (!text) return;

    setStudyTasks((currentTasks) => [
      ...currentTasks,
      {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text,
        completed: false,
        createdAt: Date.now(),
      },
    ]);
    setNewTaskText("");
    setIsTaskInputOpen(false);
  }

  function toggleStudyTask(taskId: string) {
    setStudyTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  }

  function deleteStudyTask(taskId: string) {
    setStudyTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_52%)]" />
      <div className="absolute left-1/2 top-32 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-cyber-indigo/12 blur-[120px]" />

      <section className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 pb-10 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-14">
          <motion.div
            className="space-y-8 text-center lg:text-left"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            variants={fadeUp}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3 py-1.5 text-[11px] font-semibold text-cyber-blue shadow-[0_0_0_1px_rgba(59,130,246,0.08)]"
            >
              <span>🔥</span>
              <span>Dr. A.P.J. Abdul Kalam Technical University (AKTU) Edition</span>
            </motion.div>

            <div className="space-y-5">
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading text-4xl font-black leading-[1.04] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-5xl lg:text-7xl"
              >
                Your engineering life,
                <span className="mt-3 block bg-gradient-to-r from-cyber-blue via-indigo-500 to-cyber-indigo bg-clip-text text-transparent">
                  organized in one place.
                </span>
              </motion.h1>

              <motion.p
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0 lg:text-lg"
              >
                Access semester-wise notes, PYQs, syllabus guidance, and exam hacks designed for AKTU students who want smarter preparation and faster progress.
              </motion.p>
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-3 sm:flex-row lg:items-start"
            >
              <Link
                href="/notes"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyber-blue to-cyber-indigo px-6 py-3 text-sm font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(99,102,241,0.35)]"
              >
                Explore Notes
              </Link>
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyber-blue/30 hover:text-cyber-blue dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              >
                Calculate GPA
              </Link>
            </motion.div>

            <div className="grid max-w-lg grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label} className="mini-stat-card">
                  <div className="text-xl font-black text-slate-900 dark:text-white">{item.value}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={false}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              whileHover={reduceMotion ? undefined : { y: -8, scale: 1.01 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="hero-visual-wrapper w-full"
            >
              <div className="absolute -left-10 top-10 hidden h-24 w-24 rounded-full border border-cyber-blue/20 bg-cyber-blue/10 blur-sm lg:block" />
              <div className="absolute -right-6 bottom-10 hidden h-28 w-28 rounded-full border border-cyber-indigo/20 bg-cyber-indigo/10 blur-sm lg:block" />

              <motion.div
                className="hero-visual-card w-full"
                whileHover={reduceMotion ? undefined : { boxShadow: "0 24px 60px -25px rgba(59,130,246,0.35)" }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyber-blue">Your Study Command Center</p>
                  </div>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-500"
                  >
                    Live
                  </motion.div>
                </motion.div>

                <div className="mt-5 space-y-4">
                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduceMotion ? undefined : { y: -4, borderColor: "rgba(59,130,246,0.3)" }}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 shadow-[0_14px_30px_-26px_rgba(59,130,246,0.42)] transition-all duration-200 dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Current Focus</span>
                      <span className="rounded-full border border-cyber-blue/20 bg-cyber-blue/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-cyber-blue">
                        CS
                      </span>
                    </div>

                    <div className="mt-3 flex items-end justify-between gap-3">
                      <div>
                        <div className="font-heading text-xl font-bold text-slate-900 dark:text-white">Data Structures</div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Master the fundamentals</p>
                      </div>
                      <span className="text-lg font-black text-cyber-blue">92%</span>
                    </div>

                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={false}
                        animate={{ width: "92%" }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-cyber-blue via-indigo-500 to-cyber-indigo"
                      />
                    </div>
                  </motion.div>

                  <div className="grid gap-3 sm:grid-cols-[1.25fr_0.75fr]">
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={reduceMotion ? undefined : { y: -4, borderColor: "rgba(59,130,246,0.3)" }}
                      className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-900/60"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Next Up</p>
                      <div className="mt-3 space-y-2">
                        <p className="font-heading text-lg font-bold leading-snug text-slate-900 dark:text-white">Cyber Security — PYQ Practice</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">18 similar questions available</p>
                      </div>

                      <button
                        type="button"
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3 py-1.5 text-[11px] font-semibold text-cyber-blue transition-all duration-200 hover:border-cyber-blue/40"
                      >
                        <span>Continue</span>
                        <motion.span
                          whileHover={reduceMotion ? undefined : { x: 4 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className="inline-flex"
                        >
                          →
                        </motion.span>
                      </button>
                    </motion.div>

                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={reduceMotion ? undefined : { y: -4, borderColor: "rgba(99,102,241,0.3)" }}
                      className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 transition-all duration-200 dark:border-white/10 dark:bg-slate-900/60"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Study Streak</p>
                      <div className="mt-3 flex items-end justify-between gap-2">
                        <span className="font-heading text-2xl font-black tracking-[-0.06em] text-slate-900 dark:text-white">7 DAYS</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Keep the momentum going 🔥</p>

                      <div className="mt-3 flex items-center gap-1.5">
                        {Array.from({ length: 7 }).map((_, index) => (
                          <motion.span
                            key={index}
                            initial={false}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: 0.44 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                            className={`flex h-2.5 w-2.5 rounded-full ${
                              index < 7 ? "bg-gradient-to-r from-cyber-blue to-cyber-indigo shadow-[0_0_10px_rgba(59,130,246,0.4)]" : "bg-slate-200 dark:bg-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={reduceMotion ? undefined : { y: -4, borderColor: "rgba(99,102,241,0.3)" }}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 transition-all duration-200 dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Quick Tasks</p>
                        <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                          {completedTaskCount} / {studyTasks.length} completed
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsTaskInputOpen((isOpen) => !isOpen)}
                        aria-expanded={isTaskInputOpen}
                        className="rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-2.5 py-1.5 text-[10px] font-bold text-cyber-blue transition-all duration-200 hover:border-cyber-blue/45 hover:bg-cyber-blue/15"
                      >
                        + Add task
                      </button>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <motion.div
                        initial={false}
                        animate={{ width: `${taskProgress}%` }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-cyber-blue to-cyber-indigo"
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {isTaskInputOpen && (
                        <motion.form
                          key="task-input"
                          onSubmit={addStudyTask}
                          initial={reduceMotion ? false : { opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                          className="flex gap-2 overflow-hidden pt-3"
                        >
                          <label htmlFor="new-study-task" className="sr-only">What do you need to study?</label>
                          <input
                            id="new-study-task"
                            value={newTaskText}
                            onChange={(event) => setNewTaskText(event.target.value)}
                            placeholder="What do you need to study?"
                            autoFocus
                            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyber-blue/50 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500"
                          />
                          <button
                            type="submit"
                            aria-label="Add study task"
                            className="rounded-xl bg-cyber-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-cyber-indigo"
                          >
                            Add
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {studyTasks.length === 0 ? (
                      <motion.div
                        initial={false}
                        animate={{ opacity: 1 }}
                        className="py-5 text-center"
                      >
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No tasks yet</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">Add something you want to accomplish today.</p>
                        <button
                          type="button"
                          onClick={() => setIsTaskInputOpen(true)}
                          className="mt-3 text-[11px] font-bold text-cyber-blue hover:text-cyber-indigo"
                        >
                          + Add your first task
                        </button>
                      </motion.div>
                    ) : (
                      <motion.ul layout className="mt-3 space-y-1.5" aria-label="Study tasks">
                        <AnimatePresence initial={false} mode="popLayout">
                          {sortedStudyTasks.map((task) => (
                            <motion.li
                              layout
                              key={task.id}
                              initial={false}
                              animate={{ opacity: task.completed ? 0.58 : 1, x: 0 }}
                              exit={reduceMotion ? undefined : { opacity: 0, x: 10, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="group flex min-w-0 items-center gap-2 rounded-xl px-1.5 py-1.5 transition-colors duration-200 hover:bg-white/70 dark:hover:bg-white/[0.04]"
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleStudyTask(task.id)}
                                aria-label={`Mark ${task.text} as ${task.completed ? "active" : "completed"}`}
                                className="h-3.5 w-3.5 shrink-0 accent-cyber-blue"
                              />
                              <span className={`min-w-0 flex-1 truncate text-xs transition-all duration-200 ${task.completed ? "text-slate-500 line-through dark:text-slate-500" : "text-slate-700 dark:text-slate-200"}`}>
                                {task.text}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteStudyTask(task.id)}
                                aria-label={`Delete ${task.text}`}
                                className="shrink-0 rounded-md px-1.5 py-1 text-xs text-slate-400 opacity-0 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-400 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue/50 group-hover:opacity-100"
                              >
                                <span aria-hidden="true">×</span>
                              </button>
                            </motion.li>
                          ))}
                        </AnimatePresence>
                      </motion.ul>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className="search-panel mx-auto mt-3 max-w-2xl rounded-[28px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
          <SearchBar />
        </div>
      </section>

      <section className="mx-auto mt-18 max-w-7xl pt-8">
        <div className="mb-8 flex flex-col gap-3 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyber-blue">Why students prefer it</p>
          <h2 className="font-heading text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            Built for the student grind.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {valuePillars.map((card) => (
            <div key={card.title} className="feature-card">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-blue/15 to-cyber-indigo/10 text-2xl shadow-inner shadow-cyber-blue/10">
                {card.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-18 max-w-7xl py-8">
        <div className="rounded-[30px] border border-slate-200/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyber-blue">Official updates</p>
              <h3 className="mt-2 font-heading text-2xl font-black text-slate-900 dark:text-white">Stay on top of AKTU circulars and exam news.</h3>
            </div>
            <a
              href="https://aktu.ac.in/circulars.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Read Circulars ↗
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl pb-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-blue/10 text-lg">📖</div>
                <span className="text-[10px] font-extrabold tracking-wider text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2.5 py-0.5 rounded">
                  NOTES
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors">Semester Notes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Access unit-wise notes, syllabus direction, and important questions for every semester.</p>
            </div>
            <div className="pt-6"><Link href="/notes" className="inline-flex items-center gap-1 text-xs font-bold text-cyber-blue">Enter Portal <span>→</span></Link></div>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyber-indigo/10 text-lg">🕒</div>
                <span className="text-[10px] font-extrabold tracking-wider text-cyber-indigo bg-cyber-indigo/10 border border-cyber-indigo/20 px-2.5 py-0.5 rounded">PYQ</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-indigo transition-colors">Previous Year Papers</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Preview and organize exam papers by subject to prepare with confidence.</p>
            </div>
            <div className="pt-6"><Link href="/pyq" className="inline-flex items-center gap-1 text-xs font-bold text-cyber-indigo">Enter Portal <span>→</span></Link></div>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg">🧮</div>
                <span className="text-[10px] font-extrabold tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded">GPA</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">SGPA & CGPA</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">Stay on top of your grades with a calculator designed for easy planning.</p>
            </div>
            <div className="pt-6"><Link href="/calculator" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">Enter Portal <span>→</span></Link></div>
          </div>
        </div>
      </section>
    </div>
  );
}
