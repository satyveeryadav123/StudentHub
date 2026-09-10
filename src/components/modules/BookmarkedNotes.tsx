"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

interface Bookmark {
  id: string;
  title: string;
  subjectName: string;
  url: string;
}

export default function BookmarkedNotes() {
  const { user, isLoggedIn } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [supabase] = useState(() => createClient());

  useEffect(() => {
    setIsMounted(true);

    if (isLoggedIn && user?.id) {
      // Load from Supabase bookmarks table
      supabase
        .from("bookmarks")
        .select("id, resource_id, resources(id, title, type, subject_slug, unit_number, semester, file_url)")
        .eq("user_id", user.id)
        .then(({ data, error }) => {
          if (!error && data && data.length > 0) {
            const mapped = data.map((b: any) => {
              const res = Array.isArray(b.resources) ? b.resources[0] : b.resources;
              return {
                id: b.id,
                title: res?.title || "Resource Note",
                subjectName: res?.subject_slug || "Subject",
                url: res?.file_url || (res?.subject_slug ? `/notes/sem-${res.semester || 1}/${res.subject_slug}` : "/notes"),
              };
            });
            setBookmarks(mapped);
          } else {
            const stored = localStorage.getItem("studenthub_bookmarks");
            if (stored) {
              try {
                setBookmarks(JSON.parse(stored));
              } catch (err) {
                console.error("Failed to parse bookmarks:", err);
              }
            }
          }
        });
    } else {
      // Load from localStorage
      const stored = localStorage.getItem("studenthub_bookmarks");
      if (stored) {
        try {
          setBookmarks(JSON.parse(stored));
        } catch (err) {
          console.error("Failed to parse bookmarks:", err);
        }
      }
    }
  }, [isLoggedIn, user?.id, supabase]);

  const removeBookmark = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem("studenthub_bookmarks", JSON.stringify(updated));

    if (isLoggedIn && user?.id) {
      try {
        await supabase.from("bookmarks").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete bookmark:", err);
      }
    }
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
        <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">Your Bookmarks</h3>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-6 space-y-2">
          <p className="text-xs text-slate-500 leading-relaxed">
            No bookmarks saved yet.
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-600 leading-relaxed">
            Flag subjects or PDFs inside units to keep track of critical materials right here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Link
                href={bookmark.url}
                className="block p-3 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-all group relative pr-10"
              >
                <div className="text-[10px] font-semibold text-cyber-blue truncate">
                  {bookmark.subjectName}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyber-blue dark:group-hover:text-white transition-colors truncate mt-0.5">
                  {bookmark.title}
                </div>
                
                {/* Remove button */}
                <button
                  onClick={(e) => removeBookmark(bookmark.id, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-all"
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
