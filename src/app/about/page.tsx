import Link from "next/link";
import { Metadata } from "next";
import CreatorProfileCard from "@/components/modules/CreatorProfileCard";

export const metadata: Metadata = {
  title: "Why StudentHub Exists | Student Story & Mission",
  description:
    "The story behind StudentHub — built solo by an AKTU engineering student to solve the hassle of scattered notes, broken drive links, and exam-time PYQ scrambles.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* 1. Hero Section */}
      <section className="text-center space-y-4 max-w-2xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyber-blue/10 px-3.5 py-1 text-xs font-semibold text-cyber-blue border border-cyber-blue/20">
          💡 Our Story • Built for AKTU Students
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Why StudentHub Exists
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          It started with a simple, frustrating problem.
        </p>
      </section>

      {/* 2. The Problem Section (Personal Story) */}
      <section className="glass-panel p-8 sm:p-10 rounded-3xl space-y-5 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-200/80 dark:border-white/5 pb-4">
          <span className="text-2xl">📱</span>
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
            The Exam-Season Scramble
          </h2>
        </div>
        <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <p>
            As an engineering student, every single exam season used to look the exact same. Two weeks before sessionals or end-semesters, my phone would explode with messages across random WhatsApp groups, Telegram channels, and seniors&apos; chat forwards.
          </p>
          <p>
            Finding quality handwritten notes or previous year question papers (PYQs) was unnecessarily painful. Half the Google Drive links seniors sent were expired or required restricted permission. The PDFs circulating in group chats were often blurry scans of outdated 2018 syllabus schemes, or completely missing Unit 4 and Unit 5 right when you needed them most.
          </p>
          <p>
            I realized every student around me was wasting hours begging for PDFs in chat groups instead of actually studying. There was no single, clean, organized place built specifically around the AKTU curriculum where you could just click your semester, select your subject, and immediately view verified materials.
          </p>
        </div>
      </section>

      {/* 3. The Solution Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
            One Organized Hub for Everything
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            StudentHub was built to end the chat-group scavenger hunt once and for all.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5">
            <div className="text-xl">📚</div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Semester & Subject Directory
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Cleanly structured unit-wise notes, syllabus outlines, and study materials organized strictly by AKTU subject codes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5">
            <div className="text-xl">📄</div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Verified PYQ Archives
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Year-wise end-semester and sessional question papers (2021 to 2026) complete with solved answer keys.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5">
            <div className="text-xl">🧮</div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Official AKTU Calculator
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              A 10-point absolute grading calculator modeled directly on the Dr. A.P.J. Abdul Kalam Technical University CBCS Ordinance.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5">
            <div className="text-xl">💼</div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Placement & Resume Vault
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Recruiter-tested LaTeX/Word resume templates and core CS fundamentals sheets to help you crack campus placements.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Built By Section */}
      <section className="glass-panel p-8 sm:p-10 lg:p-12 rounded-3xl relative overflow-hidden bg-white/80 dark:bg-[#090d16] border border-slate-200/80 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 transition-all duration-300">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-cyber-blue/10 via-cyber-indigo/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-cyber-indigo/10 to-transparent blur-3xl" />

        <div className="space-y-4 max-w-xl lg:max-w-2xl relative z-10 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyber-indigo uppercase tracking-wider bg-cyber-indigo/10 border border-cyber-indigo/25 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-indigo animate-pulse" />
            The Creator
          </div>
          
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug lg:whitespace-nowrap">
            Built by{" "}
            <span className="inline-block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-300">
              Satyveer Yadav
            </span>
          </h2>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs sm:text-sm font-semibold text-cyber-blue dark:text-blue-400">
              3rd Year AKTU B.Tech Computer Science Student
            </span>
            <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md">
              AKTU Batch &apos;24
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            I built StudentHub to solve a real, everyday problem I personally faced every semester. It isn&apos;t a commercial product or a flashy resume project — it&apos;s a dedicated academic utility created by an AKTU student for fellow AKTU students so nobody ever has to scramble for notes during exam week again.
          </p>

          {/* Quick Value Pillars */}
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-2 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span>⚡</span> 100% Free & Open
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span>🎯</span> AKTU Syllabus Aligned
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
              <span>🤝</span> Student-First Utility
            </span>
          </div>
        </div>

        {/* 3D Interactive Portrait Card */}
        <div className="relative z-10 shrink-0 flex justify-center w-full md:w-auto">
          <CreatorProfileCard />
        </div>
      </section>

      {/* 5. Future Scalability Roadmap */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
            Future Scalability Roadmap
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Planned updates and upcoming features for the StudentHub ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Multiple Universities
              </h3>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded tracking-wider uppercase">
                PLANNING
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Moving beyond AKTU to support other state technical universities under a unified codebase.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Bookmarks Sync
              </h3>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded tracking-wider uppercase">
                PLANNING
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enabling students to bookmark notes and access them seamlessly across mobile and desktop devices.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Cloud Backup & Real Accounts
              </h3>
              <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-0.5 rounded tracking-wider uppercase">
                PLANNING
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Moving from local-only accounts to secure, real user accounts with cloud-synced data.
            </p>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Contributor Portals
              </h3>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded tracking-wider uppercase">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Students can already upload notes and PYQs directly for admin moderation.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Community / Contribute CTA */}
      <section className="glass-panel p-8 rounded-3xl text-center space-y-4 bg-gradient-to-r from-cyber-blue/10 to-cyber-indigo/10 border border-cyber-blue/30 shadow-2xl">
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          StudentHub Grows With You
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          If you have clean handwritten notes, unit syllabus outlines, or sessional test papers, share them with fellow batchmates! Every upload goes through quick moderation before appearing on the portal.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/upload"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-blue px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            <span>📤</span>
            <span>Contribute Notes or PYQs Now</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
