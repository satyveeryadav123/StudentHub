import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#05070e] text-slate-600 dark:text-slate-400 mt-auto transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* 4-Column Layout on Desktop, Stacked on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
                StudentHub
              </span>
              <span className="text-[10px] font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2 py-0.5 rounded-md">
                AKTU Edition
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400/90 font-medium">
              Built for AKTU students, by an AKTU student.
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
              An open-source academic resource hub and productivity suite tailored specifically for engineering students to excel in exams and placements.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/notes" className="hover:text-cyber-blue transition-colors">
                  Semester Notes
                </Link>
              </li>
              <li>
                <Link href="/pyq" className="hover:text-cyber-blue transition-colors">
                  Previous Year Papers (PYQs)
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-cyber-blue transition-colors">
                  SGPA/CGPA Calculator
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-cyber-blue transition-colors">
                  Career & Placement Resources
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-cyber-blue transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cyber-blue transition-colors">
                  About StudentHub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Semesters */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              Popular Semesters
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/notes/sem-1" className="hover:text-cyber-blue transition-colors">
                  Semester 1 (Physics / Chemistry)
                </Link>
              </li>
              <li>
                <Link href="/notes/sem-2" className="hover:text-cyber-blue transition-colors">
                  Semester 2 (Maths-II / C Prog)
                </Link>
              </li>
              <li>
                <Link href="/notes/sem-3" className="hover:text-cyber-blue transition-colors">
                  Semester 3 (Data Structures / COA)
                </Link>
              </li>
              <li>
                <Link href="/notes/sem-4" className="hover:text-cyber-blue transition-colors">
                  Semester 4 (OS / DBMS / Automata)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support & Feedback */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard/upload" className="inline-flex items-center gap-1.5 text-cyber-blue font-semibold hover:underline">
                  <span>Contribute Notes</span>
                  <span>↗</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@studentshub.in"
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Report an Issue
                </a>
              </li>
              <li>
                <a
                  href="https://aktu.ac.in/circulars.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  AKTU Official Portal
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar Divider & Credits */}
        <div className="mt-12 border-t border-slate-200 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-500">
          <p>
            © {currentYear} StudentHub. Not officially affiliated with AKTU.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            Made by <span className="text-slate-800 dark:text-slate-200 font-semibold">Satyveer Yadav</span> — 3rd Year Student
          </p>
        </div>

      </div>
    </footer>
  );
}

