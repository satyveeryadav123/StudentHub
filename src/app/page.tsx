import Link from "next/link";
import SearchBar from "@/components/modules/SearchBar";

const SEMESTERS = [
  { num: 1, name: "Semester 1", desc: "Engineering Physics, Maths-I, PPS, Electrical" },
  { num: 2, name: "Semester 2", desc: "Engineering Chemistry, Maths-II, Programming" },
  { num: 3, name: "Semester 3", desc: "Data Structures, COA, Discrete Maths, Technical Writing" },
  { num: 4, name: "Semester 4", desc: "Operating Systems, DBMS, Theory of Automata, Microprocessors" },
  { num: 5, name: "Semester 5", desc: "Compiler Design, Web Tech, Computer Networks, DAA" },
  { num: 6, name: "Semester 6", desc: "Software Eng, Distributed Systems, Cloud Computing" },
  { num: 7, name: "Semester 7", desc: "Artificial Intelligence, Cryptography, Electives" },
  { num: 8, name: "Semester 8", desc: "Digital Image Processing, Project Lab, Seminar" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-10 pb-16 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyber-blue/10 px-3 py-1 text-xs font-semibold text-cyber-blue border border-cyber-blue/20">
          🔥 Dr. A.P.J. Abdul Kalam Technical University (AKTU) Edition
        </div>
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          All Engineering Resources <br />
          <span className="bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
            In One Place
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Access semester-wise syllabus, handwritten notes, previous year question papers (PYQs), important sessional questions, and calculate your SGPA/CGPA instantly.
        </p>

        {/* Dynamic Autocomplete Search Bar */}
        <div className="pt-4 max-w-md mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Main Grid: Semesters */}
      <section className="w-full max-w-7xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-white">Browse Semester Notes</h2>
            <p className="text-xs text-slate-400">Select a semester to access subject-wise resources</p>
          </div>
          <span className="text-xs font-semibold text-cyber-indigo bg-cyber-indigo/10 border border-cyber-indigo/25 px-3 py-1 rounded-lg">
            B.Tech Programme
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEMESTERS.map((sem) => (
            <Link
              key={sem.num}
              href={`/notes/sem-${sem.num}`}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between min-h-[160px] group"
            >
              <div>
                <span className="text-xs font-semibold text-cyber-blue uppercase tracking-wider mb-2 block">
                  Sem {sem.num}
                </span>
                <h3 className="font-heading text-lg font-bold text-white group-hover:text-cyber-blue transition-colors">
                  {sem.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sem.desc}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 group-hover:text-white transition-colors">
                <span>View Syllabus & Notes</span>
                <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section className="w-full max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Calculator Promo */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-2xl -z-10 group-hover:bg-cyber-blue/20 transition-colors" />
          <span className="text-2xl mb-4 block">🧮</span>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            SGPA & CGPA Grade Planner
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Calculate your semester credits, convert percentages, and project target CGPAs based on the standard AKTU grading guidelines. Save your scores to track academic trends.
          </p>
          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
          >
            Launch Calculator
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </Link>
        </div>

        {/* Resources Promo */}
        <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-indigo/10 rounded-full blur-2xl -z-10 group-hover:bg-cyber-indigo/20 transition-colors" />
          <span className="text-2xl mb-4 block">💼</span>
          <h3 className="font-heading text-xl font-bold text-white mb-2">
            Placement & Resume Blueprint
          </h3>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Get recruiter-approved resume templates (LaTeX/Word format), explore top DSA practice sheets, study computer science fundamentals, and prepare for campus placements.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all hover:-translate-y-0.5"
          >
            Access Placement Guide
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </Link>
        </div>

      </section>

      {/* Live Updates Section */}
      <section className="w-full max-w-7xl mx-auto py-6">
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-cyber-blue">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyber-blue"></span>
              </span>
              <h4 className="text-sm font-bold text-white">Latest AKTU Notice:</h4>
              <p className="text-xs text-slate-400">Even Semester examination schedules have been published. Check ERP portals for exam center lists.</p>
            </div>
            <a
              href="https://aktu.ac.in/whatsnew.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyber-blue font-semibold hover:underline shrink-0"
            >
              Read Circulars →
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
