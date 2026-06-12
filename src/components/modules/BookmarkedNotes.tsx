"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Bookmark {
  id: string;
  title: string;
  subjectName: string;
  url: string;
}

export default function BookmarkedNotes() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("studenthub_bookmarks");
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse bookmarks:", err);
      }
    }
  }, []);

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("studenthub_bookmarks", JSON.stringify(updated));
  };

  // Prevent hydration mismatch (don't render on server)
  if (!isMounted) {
    return (
      <div className="glass-panel p-6 rounded-2xl animate-pulse space-y-4">
        <div className="h-4 bg-white/5 w-1/3 rounded" />
        <div className="h-10 bg-white/5 w-full rounded-xl" />
        <div className="h-10 bg-white/5 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-base">🔖</span>
        <h3 className="font-heading text-base font-bold text-white">Your Bookmarks</h3>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <p className="text-xs text-slate-500 leading-relaxed">
            No bookmarks saved yet.
          </p>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Flag subjects or PDFs inside units to keep track of critical materials right here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Link
                href={bookmark.url}
                className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group relative pr-10"
              >
                <div className="text-[10px] font-semibold text-cyber-blue truncate">
                  {bookmark.subjectName}
                </div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors truncate mt-0.5">
                  {bookmark.title}
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => removeBookmark(bookmark.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
                  title="Remove bookmark"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
