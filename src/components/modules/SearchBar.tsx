"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  semester: number | string;
  href: string;
  source?: "database" | "static";
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (idx: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: idx * 0.03, duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function getTypeIcon(type: string): string {
  switch (type?.toUpperCase()) {
    case "NOTES_PDF":
      return "📚";
    case "PYQ":
      return "📝";
    case "IMPORTANT_QUESTION":
      return "⭐";
    case "SYLLABUS":
      return "📋";
    case "SUBJECT":
    default:
      return "🎓";
  }
}

function formatTypeName(type: string): string {
  switch (type?.toUpperCase()) {
    case "NOTES_PDF":
      return "Notes";
    case "PYQ":
      return "PYQ";
    case "IMPORTANT_QUESTION":
      return "Imp Questions";
    case "SYLLABUS":
      return "Syllabus";
    case "SUBJECT":
      return "Subject";
    default:
      return type || "Resource";
  }
}

function getTypeBadgeStyle(type: string): string {
  switch (type?.toUpperCase()) {
    case "NOTES_PDF":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25";
    case "PYQ":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25";
    case "IMPORTANT_QUESTION":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
    case "SYLLABUS":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
    case "SUBJECT":
    default:
      return "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/25";
  }
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // 300ms Debounced API Search with min 2 characters
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal }
        );
        if (response.ok) {
          const data = await response.json();
          if (!signal.aborted) {
            setResults(data.results || []);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Search fetch error:", err);
        }
      } finally {
        if (!signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key to close dropdown
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFocused(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsLoading(false);
    setIsFocused(false);
  };

  const handleSelectResult = (href: string) => {
    setIsFocused(false);
    setQuery("");
    setResults([]);
    setIsLoading(false);
    router.push(href);
  };

  const showDropdown = isFocused && query.trim().length >= 2;

  return (
    <div ref={containerRef} className="relative z-[70] mx-auto w-full max-w-xl">
      {/* Input container with exact search styling */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search 65+ subjects by name, code or PYQ (e.g. Cyber, BCS301, PYQ)..."
          className="glass-panel w-full rounded-2xl border border-slate-200/80 bg-white/90 px-5 py-3.5 pl-12 pr-10 text-sm text-slate-900 shadow-lg shadow-black/5 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100 dark:placeholder:text-slate-500 dark:shadow-black/20"
        />
        
        {/* Search Magnifier Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>

        {/* Right Status / Clear Button */}
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

      {/* Results Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            animate={prefersReducedMotion ? { opacity: 1, y: 0, scale: 1 } : "visible"}
            exit={prefersReducedMotion ? { opacity: 0 } : "hidden"}
            variants={dropdownVariants}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-[22rem] overflow-hidden overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 dark:bg-[#090d16]/95 shadow-[0_20px_45px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-white/10"
          >
            {isLoading && results.length === 0 ? (
              <div className="p-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-cyber-blue border-t-transparent rounded-full animate-spin" />
                <span>Searching curriculum & resources...</span>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Search Results ({results.length})
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-white/5">
                  {results.map((result, idx) => (
                    <motion.li
                      key={`${result.id}-${result.href}-${idx}`}
                      variants={itemVariants}
                      custom={idx}
                      initial={prefersReducedMotion ? false : "hidden"}
                      animate={prefersReducedMotion ? { opacity: 1, y: 0 } : "visible"}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectResult(result.href)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-slate-100/80 dark:hover:bg-white/5 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Type Icon */}
                          <span className="text-xl shrink-0">
                            {getTypeIcon(result.type)}
                          </span>

                          {/* Title & Semester */}
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-cyber-blue transition-colors">
                              {result.title}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              Semester {result.semester}
                            </span>
                          </div>
                        </div>

                        {/* Small Type Badge */}
                        <div className="shrink-0">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-[10px] font-bold uppercase ${getTypeBadgeStyle(
                              result.type
                            )}`}
                          >
                            {formatTypeName(result.type)}
                          </span>
                        </div>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                {!isLoading && `No results found for "${query}"`}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
