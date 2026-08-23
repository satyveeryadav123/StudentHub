"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error logged:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl my-16 p-8 glass-panel rounded-3xl text-center space-y-4 border border-rose-500/20 bg-white/80 dark:bg-[#090d16] shadow-xl">
      <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold border border-rose-500/20">
        ⚠️
      </div>
      <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
        Something went wrong!
      </h2>
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        {error?.message || "An error occurred while rendering this page."}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all"
      >
        Try Again
      </button>
    </div>
  );
}
