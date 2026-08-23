import Link from "next/link";
import { notFound } from "next/navigation";
import { SUBJECT_DATA, normalizeSemesterKey } from "@/lib/subjects";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ semester: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const semKey = normalizeSemesterKey(resolvedParams.semester);
  const semesterData = SUBJECT_DATA[semKey];

  if (!semesterData) {
    return { title: "Semester Not Found | StudentHub" };
  }

  return {
    title: `${semesterData.title} PYQs | AKTU Previous Year Question Papers`,
    description: `Download official AKTU previous year question papers for ${semesterData.title} subjects including ${semesterData.subjects.slice(0, 3).map(s => s.name).join(", ")}.`,
  };
}

export default async function PYQSemesterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const semKey = normalizeSemesterKey(resolvedParams.semester);
  const semesterData = SUBJECT_DATA[semKey];

  if (!semesterData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/pyq" className="hover:text-slate-900 dark:hover:text-white transition-colors">PYQs</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">{semesterData.title}</span>
      </nav>

      {/* Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            {semesterData.title} PYQ Papers
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Access previous year question papers (2020-2025) and sessional exams ({semesterData.subjects.length} Subjects).
          </p>
        </div>
        
        {/* Badges */}
        <div className="flex gap-2 text-xs">
          <span className="bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-3 py-1 rounded-lg font-semibold">
            AKTU End-Sem & Sessionals
          </span>
          <span className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 font-semibold">
            B.Tech CSE
          </span>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {semesterData.subjects.map((subject, idx) => (
          <Link
            key={idx}
            href={`/pyq/${semKey}/${subject.slug}`}
            className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
                <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/5 border border-cyber-blue/25 px-2.5 py-0.5 rounded">
                  {subject.code}
                </span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded font-medium ${
                    subject.type === "Theory"
                      ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                      : subject.type === "Practical"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                  }`}>
                    {subject.type}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">
                    {subject.credits} {subject.credits === 1 ? "Credit" : "Credits"}
                  </span>
                </div>
              </div>
              
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyber-blue transition-colors leading-snug">
                {subject.name}
              </h3>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                {subject.desc}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-end text-xs font-semibold text-cyber-blue group-hover:text-slate-900 dark:group-hover:text-white transition-all gap-1.5 pt-3 border-t border-slate-200/80 dark:border-white/5">
              <span>View PYQ Papers</span>
              <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

    </div>
  );
}
