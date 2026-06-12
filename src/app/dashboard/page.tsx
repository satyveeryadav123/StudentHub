"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookmarkedNotes from "@/components/modules/BookmarkedNotes";

interface SavedCalculation {
  id: string;
  type: string;
  score: number;
  date: string;
}

export default function StudentDashboardPage() {
  const [calculations, setCalculations] = useState<SavedCalculation[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("studenthub_saved_calc");
    if (stored) {
      try {
        setCalculations(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const deleteCalculation = (id: string) => {
    const updated = calculations.filter((c) => c.id !== id);
    setCalculations(updated);
    localStorage.setItem("studenthub_saved_calc", JSON.stringify(updated));
  };

  // Prevent hydration mismatch (don't render on server)
  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-8 bg-white/5 w-1/4 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-48 bg-white/5 md:col-span-2 rounded-2xl" />
          <div className="h-48 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Welcome Banner */}
      <section className="glass-panel p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyber-blue/5 rounded-full blur-3xl -z-10" />
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
            Guest Student Mode
          </span>
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Welcome to Student Portal
          </h1>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            Your bookmarks and calculators are saved locally in this browser. Create an account to synchronize your academic files across multiple devices.
          </p>
        </div>
        
        <button
          onClick={() => alert("Authentication system (Supabase Auth) will be integrated in Phase 7.")}
          className="inline-flex items-center justify-center rounded-xl bg-cyber-blue px-5 py-3 text-xs font-bold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/20"
        >
          Create Account / Sync Data
        </button>
      </section>

      {/* Main Grid: Left Column: Grades / Quick Actions; Right Column: Bookmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Grid: Grade Calculations & Quick tools */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Saved Grades history */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
              <span>📈</span> Saved Grade Calculations
            </h3>
            
            {calculations.length === 0 ? (
              <div className="text-center py-8 bg-white/[0.01] border border-white/5 rounded-xl space-y-3">
                <p className="text-xs text-slate-500">No grades calculated yet.</p>
                <Link
                  href="/calculator"
                  className="inline-flex text-xs font-semibold text-cyber-blue hover:underline"
                >
                  Calculate SGPA now →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {calculations.map((calc) => (
                  <div
                    key={calc.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between relative group"
                  >
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        calc.type === "SGPA"
                          ? "bg-cyber-blue/10 text-cyber-blue"
                          : "bg-cyber-indigo/10 text-cyber-indigo"
                      }`}>
                        {calc.type} Score
                      </span>
                      <div className="text-2xl font-extrabold text-white mt-2">
                        {calc.score}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 block">Saved: {calc.date}</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => deleteCalculation(calc.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"
                      title="Delete entry"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/dashboard/upload"
              className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-2 group"
            >
              <span className="text-xl">📤</span>
              <h3 className="font-heading text-sm font-bold text-white group-hover:text-cyber-blue transition-colors">
                Contribute Syllabus Notes
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Have verified notes or sessional question papers? Share them with other AKTU students.
              </p>
            </Link>

            <Link
              href="/resources"
              className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-2 group"
            >
              <span className="text-xl">🎯</span>
              <h3 className="font-heading text-sm font-bold text-white group-hover:text-cyber-indigo transition-colors">
                Placement Guides
              </h3>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Browse ATS resume blueprints, software engineering cheat sheets, and interview prep guides.
              </p>
            </Link>
          </div>

        </div>

        {/* Right Grid: Bookmarks List */}
        <div className="space-y-6">
          <BookmarkedNotes />
        </div>

      </div>

    </div>
  );
}
