"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SearchResult {
  name: string;
  code: string;
  semester: string;
  url: string;
  type: string;
  category?: "Notes" | "PYQ";
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: idx * 0.04, duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, { signal });
        if (response.ok) {
          const data = await response.json();
          if (!signal.aborted) {
            setResults(data);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 200);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsFocused(false);
  };

  const handleSelectResult = (url: string) => {
    setIsFocused(false);
    setQuery("");
    setResults([]);
    setIsLoading(false);
    router.push(url);
  };

  const showDropdown = isFocused && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative z-[70] mx-auto w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search 65+ subjects by name, code or PYQ (e.g. Cyber, BCS301, PYQ)..."
          className="glass-panel w-full rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3.5 pl-12 pr-10 text-sm text-slate-900 shadow-lg shadow-black/5 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:shadow-black/20"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin text-cyber-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-0.5 text-slate-400 transition-colors hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : "visible"}
            exit={prefersReducedMotion ? { opacity: 0 } : "hidden"}
            variants={dropdownVariants}
            transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-[22rem] overflow-hidden overflow-y-auto rounded-2xl border border-slate-200/80 bg-slate-950/95 shadow-[0_20px_45px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
          >
            {results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Matching Notes & PYQs ({results.length})
                </div>
                <ul className="divide-y divide-slate-800/80 dark:divide-white/5">
                  {results.map((result, idx) => (
                    <motion.li
                      key={`${result.url}-${idx}`}
                      variants={itemVariants}
                      custom={idx}
                      initial={prefersReducedMotion ? false : "hidden"}
                      animate={prefersReducedMotion ? { opacity: 1, y: 0 } : "visible"}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectResult(result.url)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-white/5"
                      >
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate text-sm font-semibold text-slate-100 transition-colors hover:text-cyber-blue">
                            {result.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-mono text-cyber-blue">[{result.code}]</span>
                            <span>•</span>
                            <span>{result.semester}</span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          {result.category && (
                            <span
                              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${
                                result.category === "PYQ"
                                  ? "border-purple-500/25 bg-purple-500/10 text-purple-300"
                                  : "border-cyan-500/25 bg-cyan-500/10 text-cyan-300"
                              }`}
                            >
                              {result.category}
                            </span>
                          )}
                          <span
                            className={`rounded border px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              result.type === "Theory"
                                ? "border-indigo-500/25 bg-indigo-500/10 text-indigo-300"
                                : result.type === "Practical"
                                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                                  : "border-amber-500/25 bg-amber-500/10 text-amber-300"
                            }`}
                          >
                            {result.type}
                          </span>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                {!isLoading && `No AKTU subjects found matching "${query}"`}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
