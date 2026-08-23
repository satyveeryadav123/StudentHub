import Link from "next/link";
import BookmarkedNotes from "@/components/modules/BookmarkedNotes";
import { SUBJECT_DATA } from "@/lib/subjects";

const SEMESTERS = [
  { num: 1, name: "Semester 1", code: "sem-1" },
  { num: 2, name: "Semester 2", code: "sem-2" },
  { num: 3, name: "Semester 3", code: "sem-3" },
  { num: 4, name: "Semester 4", code: "sem-4" },
  { num: 5, name: "Semester 5", code: "sem-5" },
  { num: 6, name: "Semester 6", code: "sem-6" },
  { num: 7, name: "Semester 7", code: "sem-7" },
  { num: 8, name: "Semester 8", code: "sem-8" },
];

const BRANCHES = [
  { name: "Computer Science (CSE)", icon: "💻" },
  { name: "Electronics & Communication (ECE)", icon: "⚛️" },
  { name: "Mechanical Engineering (ME)", icon: "⚙️" },
  { name: "Civil Engineering (CE)", icon: "🏗️" },
];

export default function NotesIndex() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Directory Title */}
      <section className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3 py-1 text-xs font-bold text-cyber-blue">
          <span>📚</span>
          <span>AKTU Engineering Curriculum Directory</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          Semester Notes & Syllabus
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          All 8 semesters covering complete 65 subjects, unit outlines, and handwritten notes.
        </p>
      </section>

      {/* Main Grid split: Left Semesters, Right Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Semesters list */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SEMESTERS.map((sem) => {
              const semData = SUBJECT_DATA[sem.code];
              const count = semData ? semData.subjects.length : 0;

              return (
                <Link
                  key={sem.num}
                  href={`/notes/${sem.code}`}
                  className="glass-panel glass-panel-hover p-6 rounded-3xl flex items-center justify-between group bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg hover:border-cyber-blue/40 transition-all"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-wider bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded">
                      {count} Subjects
                    </span>
                    <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors">
                      {sem.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Theory, Labs & Syllabus Outlines
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-cyber-blue/10 group-hover:text-cyber-blue transition-all shrink-0">
                    <svg className="h-5 w-5 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Engineering Streams info card */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">Supported Engineering Disciplines</h3>
            <div className="grid grid-cols-2 gap-4">
              {BRANCHES.map((b, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-lg">{b.icon}</span>
                  <span>{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Bookmarks sidebar widget */}
        <div className="space-y-6">
          <BookmarkedNotes />
        </div>

      </div>

    </div>
  );
}
