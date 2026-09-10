"use client";

import Link from "next/link";
import SearchBar from "@/components/modules/SearchBar";

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
  const line1Words = ["Your", "engineering", "life,"];
  const line2Words = ["organized", "in", "one", "place."];

  return (
    <div className="relative overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* Subtle Ambient Background Atmosphere */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_55%)]" />
      <div className="absolute left-1/2 top-24 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-cyber-indigo/12 blur-[140px] animate-subtle-ambient" />

      <section className="mx-auto max-w-5xl text-center">
        <div className="mx-auto max-w-3xl space-y-6 pb-4 pt-4 sm:pt-6 lg:pt-8">
          {/* AKTU Official Badge */}
          <div
            style={{ animationDelay: "50ms" }}
            className="animate-hero-fade-up inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3.5 py-1.5 text-xs font-semibold text-cyber-blue shadow-[0_0_0_1px_rgba(59,130,246,0.08)] backdrop-blur-sm"
          >
            <span>🔥</span>
            <span>Dr. A.P.J. Abdul Kalam Technical University (AKTU) Edition</span>
          </div>

          {/* Staggered Modern Headline Typography */}
          <div className="space-y-3.5 sm:space-y-4">
            <h1 className="font-heading text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-900 dark:text-white sm:text-5xl lg:text-7xl">
              {/* First Line */}
              <span className="inline-flex flex-wrap justify-center gap-x-2 sm:gap-x-3.5">
                {line1Words.map((word, index) => (
                  <span
                    key={`line1-${index}`}
                    style={{ animationDelay: `${120 + index * 70}ms` }}
                    className="animate-hero-fade-up inline-block"
                  >
                    {word}
                  </span>
                ))}
              </span>

              {/* Second Highlighted Line */}
              <span className="relative mt-2 block">
                <span className="inline-flex flex-wrap justify-center gap-x-2 sm:gap-x-3.5">
                  {line2Words.map((word, index) => (
                    <span
                      key={`line2-${index}`}
                      style={{ animationDelay: `${330 + index * 70}ms` }}
                      className="animate-hero-fade-up inline-block"
                    >
                      <span className="shimmer-gradient-text inline-block bg-gradient-to-r from-cyber-blue via-indigo-400 to-cyber-indigo bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(59,130,246,0.25)]">
                        {word}
                      </span>
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            {/* Supporting Paragraph */}
            <p
              style={{ animationDelay: "620ms" }}
              className="animate-hero-fade-up mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg"
            >
              Access semester-wise notes, PYQs, syllabus guidance, and exam hacks designed for AKTU students who want smarter preparation and faster progress.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{ animationDelay: "740ms" }}
            className="animate-hero-fade-up flex flex-col items-center justify-center gap-3 sm:flex-row pt-1"
          >
            <Link
              href="/notes"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyber-blue to-cyber-indigo px-7 py-3.5 text-sm font-bold text-white shadow-[0_18px_40px_rgba(59,130,246,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(99,102,241,0.35)]"
            >
              Explore Notes
            </Link>
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-cyber-blue/30 hover:text-cyber-blue dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            >
              Calculate GPA
            </Link>
          </div>

          {/* Mini Stat Cards */}
          <div className="mx-auto grid max-w-md grid-cols-3 gap-3 pt-1">
            {statItems.map((item, index) => (
              <div
                key={item.label}
                style={{ animationDelay: `${840 + index * 60}ms` }}
                className="animate-hero-fade-up mini-stat-card"
              >
                <div className="text-xl font-black text-slate-900 dark:text-white">{item.value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar Panel */}
        <div
          style={{ animationDelay: "1020ms" }}
          className="animate-hero-fade-up search-panel mx-auto mt-4 max-w-2xl rounded-[28px] border border-slate-200/80 bg-white/80 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70"
        >
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
