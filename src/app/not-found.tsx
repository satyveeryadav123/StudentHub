import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md my-20 p-8 glass-panel rounded-3xl text-center space-y-5 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#090d16] shadow-2xl">
      <div className="h-16 w-16 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center mx-auto text-3xl">
        🔍
      </div>
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
          404 — Page Not Found
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The page or resource you are looking for does not exist or has been moved.
        </p>
      </div>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
