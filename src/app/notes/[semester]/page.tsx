import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBJECT_DATA, normalizeSemesterKey, hasAvailableNotes } from "@/lib/subjects";

interface PageProps {
  params: Promise<{ semester: string }>;
}

export default async function SemesterSubjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const semKey = normalizeSemesterKey(resolvedParams.semester);

  const semesterData = SUBJECT_DATA[semKey];

  // If the semester is out of bounds or not found, return 404
  if (!semesterData) {
    notFound();
  }

  const subjects = semesterData.subjects;
  const theoryCount = subjects.filter((s) => s.type === "Theory").length;
  const practicalCount = subjects.filter((s) => s.type === "Practical").length;
  const auditCount = subjects.filter((s) => s.type === "Audit").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/notes" className="hover:text-slate-900 dark:hover:text-white transition-colors">Notes</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">{semesterData.title}</span>
      </nav>

      {/* Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/5 pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber-blue/25 bg-cyber-blue/10 px-3 py-1 text-xs font-bold text-cyber-blue">
            <span>📚</span>
            <span>AKTU Official Curriculum • {semesterData.title}</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {semesterData.title} Subjects & Notes
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            All {subjects.length} subjects defined in the university evaluation scheme. Browse unit-wise syllabus outlines, handwritten notes, and solved question papers.
          </p>
        </div>
        
        {/* Stream & Stats Badges */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-3 py-1.5 rounded-xl font-bold">
            {theoryCount} Theory
          </span>
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold">
            {practicalCount} Labs
          </span>
          {auditCount > 0 && (
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl font-bold">
              {auditCount} Audit
            </span>
          )}
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const isNotesAvailable = hasAvailableNotes(subject.slug);

          return (
            <Link
              key={subject.slug}
              href={`/notes/${semKey}/${subject.slug}`}
              className="glass-panel glass-panel-hover p-6 rounded-3xl flex flex-col justify-between group bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-lg hover:border-cyber-blue/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="space-y-4">
                
                {/* Top Code & Type Badges */}
                <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
                  <span className="font-mono text-xs font-bold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/25 px-2.5 py-1 rounded-lg">
                    {subject.code}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider ${
                        subject.type === "Theory"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                          : subject.type === "Practical"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {subject.type}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                      {subject.credits} {subject.credits === 1 ? "Credit" : "Credits"}
                    </span>
                  </div>
                </div>
                
                {/* Subject Title */}
                <div>
                  <h2 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors leading-snug">
                    {subject.name}
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{semesterData.title}</span>
                    <span>•</span>
                    <span>{subject.unitsCount || 5} Units Complete Syllabus</span>
                  </div>
                </div>
                
                {/* Subject Description / Key Modules */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {subject.desc}
                </p>
              </div>

              {/* Bottom Card Footer with Resource Availability Status */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                <div>
                  {isNotesAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                      <span>✓</span> Verified Notes Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2.5 py-0.5 rounded-full">
                      <span>○</span> Syllabus Outline Ready
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-cyber-blue group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>

            </Link>
          );
        })}
      </section>

      {/* Bottom Contribution CTA */}
      <section className="glass-panel p-8 rounded-3xl bg-gradient-to-r from-cyber-blue/10 to-cyber-indigo/10 border border-cyber-blue/25 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
            Have handwritten notes for {semesterData.title}?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Help batchmates by uploading clean scanned PDFs of unit notes, sessional questions, or solved assignments.
          </p>
        </div>
        <Link
          href={`/dashboard/upload?semester=${semKey}`}
          className="shrink-0 rounded-xl bg-cyber-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all"
        >
          <span>📤</span> Contribute Notes Now
        </Link>
      </section>

    </div>
  );
}
