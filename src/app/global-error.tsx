"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#070a13] text-white font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#090d16] border border-white/10 space-y-4 shadow-2xl">
          <div className="h-12 w-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto text-xl font-bold border border-rose-500/20">
            ⚠️
          </div>
          <h2 className="text-xl font-bold text-white">Something went wrong!</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error?.message || "An unexpected application error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="w-full py-2.5 bg-cyber-blue hover:bg-blue-600 rounded-xl text-xs font-bold text-white transition-all shadow-lg shadow-cyber-blue/20"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
