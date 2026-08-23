"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const ReportModal = dynamic(() => import("./ReportModal"), { ssr: false });

interface Resource {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  downloads: number;
}

interface Unit {
  number: number;
  title: string;
  syllabus: string;
  resources: Resource[];
}

interface Subject {
  name: string;
  code: string;
  credits: number;
  slug: string;
  units: Unit[];
}

interface SubjectViewProps {
  subject: Subject;
  semesterCode: string;
}

export default function SubjectView({ subject, semesterCode }: SubjectViewProps) {
  const [activeUnitNum, setActiveUnitNum] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Report Modal states
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [selectedResourceTitle, setSelectedResourceTitle] = useState("");

  const activeUnit = subject.units.find((u) => u.number === activeUnitNum) || subject.units[0];

  // Initialize bookmark state
  useEffect(() => {
    const stored = localStorage.getItem("studenthub_bookmarks");
    if (stored) {
      try {
        const bookmarks = JSON.parse(stored);
        const hasBookmark = bookmarks.some((b: any) => b.id === `${subject.code}`);
        setIsBookmarked(hasBookmark);
      } catch (err) {
        console.error(err);
      }
    }
  }, [subject.code]);

  // Toggle bookmark action
  const toggleBookmark = () => {
    const stored = localStorage.getItem("studenthub_bookmarks");
    let bookmarks = [];
    if (stored) {
      try {
        bookmarks = JSON.parse(stored);
      } catch (err) {
        console.error(err);
      }
    }

    if (isBookmarked) {
      bookmarks = bookmarks.filter((b: any) => b.id !== `${subject.code}`);
    } else {
      bookmarks.push({
        id: `${subject.code}`,
        title: subject.name,
        subjectName: subject.code,
        url: `/notes/${semesterCode}/${subject.slug}`,
      });
    }

    localStorage.setItem("studenthub_bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  // Track downloads / views
  const handleDownload = (resId: string, title: string) => {
    console.log(`[Analytics Event] Resource Opened: "${title}" (ID: ${resId})`);
  };

  const triggerReport = (resId: string, title: string) => {
    setSelectedResourceId(resId);
    setSelectedResourceTitle(title);
    setIsReportOpen(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Subject Header Banner */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-2.5 py-0.5 rounded">
              AKTU Code: {subject.code}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Credits: {subject.credits}</span>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {subject.name}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={toggleBookmark}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-all ${
              isBookmarked
                ? "bg-cyber-blue/10 border-cyber-blue/30 text-cyber-blue"
                : "border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span className="text-sm">{isBookmarked ? "★" : "☆"}</span>
            {isBookmarked ? "Bookmarked" : "Bookmark Subject"}
          </button>
        </div>
      </div>

      {/* Grid: Unit Tabs & Active View */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Unit Tab Buttons */}
        <div className="lg:col-span-1 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {subject.units.map((unit) => (
            <button
              key={unit.number}
              onClick={() => setActiveUnitNum(unit.number)}
              className={`flex-shrink-0 text-left px-4 py-3 rounded-xl border text-xs font-semibold transition-all w-[140px] lg:w-full ${
                activeUnitNum === unit.number
                  ? "bg-cyber-blue border-cyber-blue text-white shadow-lg shadow-cyber-blue/25"
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <div className="text-[10px] opacity-80 mb-0.5">Unit {unit.number}</div>
              <div className="truncate">{unit.title}</div>
            </button>
          ))}
        </div>

        {/* Right Side: Active Unit Contents */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Syllabus Info card */}
          {activeUnit && (
            <div className="glass-panel p-6 rounded-2xl space-y-3 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/5 pb-2">
                Syllabus Outline (Unit {activeUnit.number})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                {activeUnit.syllabus}
              </p>
            </div>
          )}

          {/* Resources lists */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Unit Study Materials</h3>
            
            {!activeUnit || activeUnit.resources.length === 0 ? (
              /* Glassmorphic Empty State UI */
              <div className="glass-panel p-10 rounded-3xl text-center space-y-5 border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#090d16] shadow-xl my-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-blue/5 rounded-full blur-2xl -z-10" />
                <div className="mx-auto w-16 h-16 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/25 flex items-center justify-center text-3xl shadow-inner">
                  📂
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                    No notes uploaded yet for this subject
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Be the first to contribute! Upload handwritten notes, unit syllabus outlines, or PYQ papers to help fellow AKTU students.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/dashboard/upload"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-blue px-6 py-3 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
                  >
                    <span>📤</span>
                    <span>Contribute Notes Now</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeUnit.resources.map((res) => (
                  <div
                    key={res.id}
                    className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">
                        {res.type === "NOTES_PDF" ? "📄" : res.type === "SYLLABUS" ? "📋" : "⭐"}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{res.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Format: PDF • Downloads: {res.downloads}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Report Complaint Button */}
                      <button
                        onClick={() => triggerReport(res.id, res.title)}
                        className="p-2 text-slate-400 dark:text-slate-600 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all"
                        title="Report file"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-6.005-10.483l-1.22 2.44a9 9 0 01-5.982.723l-.327-.082a9 9 0 00-6.208-.682L3 15" />
                        </svg>
                      </button>

                      {/* Open/Download button */}
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleDownload(res.id, res.title)}
                        className="inline-flex items-center justify-center rounded-lg bg-cyber-blue/10 border border-cyber-blue/20 hover:bg-cyber-blue hover:text-white px-3.5 py-1.5 text-xs font-semibold text-cyber-blue transition-all"
                      >
                        Open PDF
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Global Report Modal component */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        resourceId={selectedResourceId}
        resourceTitle={selectedResourceTitle}
      />

    </div>
  );
}
