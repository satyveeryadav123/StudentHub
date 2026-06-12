"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchResult {
  type: string;
  name: string;
  code?: string;
  url: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debouncing search queries
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Search fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce buffer

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Handle outside clicks to collapse search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      
      {/* Search Input Box */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search subjects, codes (e.g. KCS-301), notes..."
          className="w-full glass-panel px-5 py-3.5 pl-12 pr-10 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyber-blue/50 focus:ring-1 focus:ring-cyber-blue/30 focus:outline-none transition-all shadow-lg shadow-black/20"
        />
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
        </div>
        {/* Spinner or Clear Button */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-cyber-blue" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown Results */}
      {isFocused && (query.trim().length > 0) && (
        <div className="absolute left-0 right-0 mt-2 z-50 glass-panel bg-brand-bg/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10">
          {results.length > 0 ? (
            <div className="py-2">
              <div className="px-4 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Matching Suggestions
              </div>
              <ul className="divide-y divide-white/5">
                {results.map((result, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => {
                        setIsFocused(false);
                        router.push(result.url);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                          {result.name}
                        </span>
                        {result.code && (
                          <span className="text-xs text-slate-500">{result.code}</span>
                        )}
                      </div>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                        result.type === "subject"
                          ? "bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20"
                          : "bg-cyber-indigo/10 text-cyber-indigo border-cyber-indigo/20"
                      }`}>
                        {result.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm">
              {!isLoading && `No results found for "${query}"`}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
