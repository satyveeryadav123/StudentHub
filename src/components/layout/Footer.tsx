import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-[#05070e] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
              StudentHub
            </span>
            <p className="text-xs leading-relaxed text-slate-500">
              An open-source academic resource hub and productivity suite tailored specifically for engineering students to excel in exams and placements.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Resources
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/notes" className="hover:text-white transition-colors">
                  Semester Notes
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-white transition-colors">
                  SGPA/CGPA Calculators
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Resume Guidelines
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-white transition-colors">
                  Placement Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: University Shortcuts */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">
              AKTU Portals
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://aktu.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Official AKTU Website
                </a>
              </li>
              <li>
                <a
                  href="https://erp.aktu.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  AKTU ERP Login
                </a>
              </li>
              <li>
                <a
                  href="https://aktu.ac.in/syllabus.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  AKTU Syllabus Directory
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Disclaimer */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider uppercase">
              Notice
            </h3>
            <p className="text-[10px] leading-relaxed text-slate-500">
              Disclaimer: StudentHub is a community platform and is not affiliated with, authorized, or endorsed by the Dr. A.P.J. Abdul Kalam Technical University (AKTU). All official circulars and results should be verified on ERP.
            </p>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="mt-8 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {currentYear} StudentHub. Designed for engineering excellence.
          </p>
          <div className="flex gap-6 text-xs text-slate-600">
            <Link href="/about" className="hover:text-slate-400">About Us</Link>
            <Link href="/contact" className="hover:text-slate-400">Feedback</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
