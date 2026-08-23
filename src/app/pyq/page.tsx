import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AKTU PYQs | Previous Year Question Papers (B.Tech CSE)",
  description: "Download official AKTU end-semester previous year question papers (PYQs) and sessional test papers across all 8 semesters for B.Tech Computer Science.",
};

const SEMESTERS = [
  { num: 1, name: "Semester 1", code: "sem-1", desc: "Physics, Chemistry, Maths-I, Electrical, Electronics" },
  { num: 2, name: "Semester 2", code: "sem-2", desc: "Maths-II, Programming in C, Ecology, Workshop" },
  { num: 3, name: "Semester 3", code: "sem-3", desc: "Data Structures, COA, Discrete Maths, Cyber Security" },
  { num: 4, name: "Semester 4", code: "sem-4", desc: "Operating Systems, DBMS, Automata, Technical Comm" },
  { num: 5, name: "Semester 5", code: "sem-5", desc: "Compiler Design, Computer Networks, DAA, Web Tech" },
  { num: 6, name: "Semester 6", code: "sem-6", desc: "Software Engineering, Data Science & ML, Graphics" },
  { num: 7, name: "Semester 7", code: "sem-7", desc: "Artificial Intelligence, Cryptography, Deep Learning" },
  { num: 8, name: "Semester 8", code: "sem-8", desc: "High Performance Computing, Big Data Analytics" },
];

export default function PYQIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Page Header */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyber-blue/10 px-3 py-1 text-xs font-semibold text-cyber-blue border border-cyber-blue/20">
          📄 AKTU Exam Archives
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Previous Year Question Papers (PYQs)
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Access official AKTU end-semester question papers, sessional mid-term exams, and model solution papers organized by academic semester and year.
        </p>
      </section>

      {/* Semesters Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Select Semester</h2>
          <span className="text-xs font-semibold text-cyber-indigo bg-cyber-indigo/10 border border-cyber-indigo/25 px-3 py-1 rounded-lg">
            All 8 Semesters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEMESTERS.map((sem) => (
            <Link
              key={sem.num}
              href={`/pyq/${sem.code}`}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between min-h-[170px] group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-wider">
                    Sem {sem.num}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded">
                    AKTU PYQ
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors">
                  {sem.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {sem.desc}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 group-hover:text-cyber-blue dark:group-hover:text-white transition-colors pt-3 border-t border-slate-200/80 dark:border-white/5">
                <span>View PYQ Papers</span>
                <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Callout */}
      <section className="glass-panel p-8 rounded-3xl bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Have PYQ papers to share?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Help your junior AKTU batchmates by contributing your sessional test papers and end-sem question papers to the StudentHub archive.
          </p>
        </div>
        <Link
          href="/dashboard/upload?type=pyq"
          className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all shrink-0"
        >
          Contribute PYQs
          <span>↗</span>
        </Link>
      </section>

    </div>
  );
}
