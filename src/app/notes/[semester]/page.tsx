import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ semester: string }>;
}

// Mock database mapping semesters to their AKTU B.Tech subjects
const SUBJECT_DATA: Record<
  string,
  {
    title: string;
    subjects: { name: string; code: string; credits: number; slug: string; desc: string }[];
  }
> = {
  "sem-1": {
    title: "Semester 1",
    subjects: [
      { name: "Engineering Mathematics-I", code: "KAS-103", credits: 4, slug: "engineering-mathematics-1", desc: "Matrices, Differential Calculus, Multivariable Calculus, Vector Calculus." },
      { name: "Engineering Physics", code: "KAS-101", credits: 4, slug: "engineering-physics", desc: "Optics, Wave Mechanics, Electromagnetism, Quantum Physics, Lasers." },
      { name: "Programming for Problem Solving", code: "KCS-101", credits: 3, slug: "programming-problem-solving", desc: "C programming, arrays, pointers, structures, file operations." },
    ],
  },
  "sem-2": {
    title: "Semester 2",
    subjects: [
      { name: "Engineering Mathematics-II", code: "KAS-203", credits: 4, slug: "engineering-mathematics-2", desc: "Ordinary Differential Equations, Multivariable Integration, Laplace Transforms." },
      { name: "Engineering Chemistry", code: "KAS-201", credits: 4, slug: "engineering-chemistry", desc: "Atomic Structure, Fuels, Polymers, Water Treatment, Engineering Materials." },
    ],
  },
  "sem-3": {
    title: "Semester 3",
    subjects: [
      { name: "Data Structures & Algorithms", code: "KCS-301", credits: 4, slug: "data-structures-algorithms", desc: "Stacks, Queues, Linked Lists, Trees, Graph Algorithms, Sorting, Searching." },
      { name: "Computer Organization & Architecture", code: "KCS-302", credits: 4, slug: "computer-organization-architecture", desc: "Instruction sets, CPU design, ALU, memory hierarchy, input/output structures." },
      { name: "Discrete Mathematics", code: "KCS-303", credits: 4, slug: "discrete-mathematics", desc: "Sets, relations, function proofs, graph theory, algebraic structures, combinatorics." },
    ],
  },
  "sem-4": {
    title: "Semester 4",
    subjects: [
      { name: "Operating Systems", code: "KCS-401", credits: 4, slug: "operating-systems", desc: "Process scheduling, threads, deadlocks, memory management, file systems, disk scheduling." },
      { name: "Database Management Systems", code: "KCS-402", credits: 4, slug: "database-management-systems", desc: "ER modeling, relational algebra, SQL, normalization, transactions, concurrency." },
      { name: "Theory of Automata & Formal Languages", code: "KCS-403", credits: 4, slug: "theory-automata", desc: "Finite automata, regular expressions, context-free grammars, Turing machines." },
    ],
  },
};

export default async function SemesterSubjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const semKey = resolvedParams.semester.toLowerCase();

  const semesterData = SUBJECT_DATA[semKey];

  // If the semester is out of bounds or not seeded, show standard 404 page
  if (!semesterData) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/notes" className="hover:text-white transition-colors">Notes</Link>
        <span>/</span>
        <span className="text-slate-300 font-semibold">{semesterData.title}</span>
      </nav>

      {/* Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-extrabold text-white">
            {semesterData.title} Subjects
          </h1>
          <p className="text-sm text-slate-400">
            Access unit syllabus guides, handwritten notes, and solved PYQ sets.
          </p>
        </div>
        
        {/* Course/Branch Indicator Badge */}
        <div className="flex gap-2 text-xs">
          <span className="bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 px-3 py-1 rounded-lg font-semibold">
            AKTU Syllabus
          </span>
          <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-slate-400 font-semibold">
            B.Tech CSE
          </span>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {semesterData.subjects.map((subject, idx) => (
          <Link
            key={idx}
            href={`/notes/${semKey}/${subject.slug}`}
            className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/5 border border-cyber-blue/25 px-2.5 py-0.5 rounded">
                  {subject.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Credits: {subject.credits}
                </span>
              </div>
              
              <h3 className="font-heading text-xl font-bold text-white group-hover:text-cyber-blue transition-colors">
                {subject.name}
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {subject.desc}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-end text-xs font-semibold text-cyber-blue group-hover:text-white transition-all gap-1.5">
              <span>Explore Materials</span>
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
