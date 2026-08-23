"use client";

import { useState } from "react";
import Link from "next/link";

export interface PYQItem {
  id: string;
  year: string; // e.g., "2024-25"
  examType: string; // "End Semester" | "Sessional 1" | "Sessional 2" | "Model Paper"
  title: string;
  fileUrl: string;
  downloads: number;
  isSolved: boolean;
}

export interface PYQSubjectData {
  semTitle: string;
  semKey: string;
  name: string;
  code: string;
  credits: number;
  slug: string;
  papers: PYQItem[];
}

const DEFAULT_ACADEMIC_YEARS = ["2025-26", "2024-25", "2023-24", "2022-23", "2021-22"];

// Curated PYQ Papers for core subjects
const CURATED_PYQ_DATABASE: Record<string, PYQItem[]> = {
  "data-structures": [
    { id: "dsa-2024-end", year: "2024-25", examType: "End Semester", title: "AKTU End-Sem Question Paper (2024-25 Regular)", fileUrl: "#", downloads: 580, isSolved: true },
    { id: "dsa-2024-sess1", year: "2024-25", examType: "Sessional 1", title: "Unit 1 & 2 Sessional Test Paper (2024-25)", fileUrl: "#", downloads: 210, isSolved: true },
    { id: "dsa-2023-end", year: "2023-24", examType: "End Semester", title: "AKTU End-Sem Question Paper & Answer Key (2023-24)", fileUrl: "#", downloads: 920, isSolved: true },
    { id: "dsa-2022-end", year: "2022-23", examType: "End Semester", title: "AKTU End-Sem Official Question Paper (2022-23)", fileUrl: "#", downloads: 740, isSolved: false },
  ],
  "computer-organization-architecture": [
    { id: "coa-2024-end", year: "2024-25", examType: "End Semester", title: "AKTU End-Sem Question Paper (2024-25)", fileUrl: "#", downloads: 410, isSolved: false },
    { id: "coa-2023-end", year: "2023-24", examType: "End Semester", title: "AKTU End-Sem Solved Solution Paper (2023-24)", fileUrl: "#", downloads: 630, isSolved: true },
  ],
  "operating-systems": [
    { id: "os-2024-end", year: "2024-25", examType: "End Semester", title: "AKTU End-Sem Official Question Paper (2024-25)", fileUrl: "#", downloads: 520, isSolved: true },
    { id: "os-2023-end", year: "2023-24", examType: "End Semester", title: "AKTU End-Sem Question Paper (2023-24)", fileUrl: "#", downloads: 810, isSolved: true },
  ],
  "database-management-systems": [
    { id: "dbms-2024-end", year: "2024-25", examType: "End Semester", title: "AKTU End-Sem Solved Question Paper (2024-25)", fileUrl: "#", downloads: 690, isSolved: true },
  ],
  "engineering-chemistry": [
    { id: "chem-2024-end", year: "2024-25", examType: "End Semester", title: "AKTU End-Sem Chemistry Paper (2024-25)", fileUrl: "#", downloads: 490, isSolved: true },
  ],
};

export default function PYQSubjectView({ subject }: { subject: PYQSubjectData }) {
  const [selectedExamFilter, setSelectedExamFilter] = useState<string>("ALL");

  const pyqList = CURATED_PYQ_DATABASE[subject.slug] || subject.papers || [];
  const hasAnyPapers = pyqList.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/pyq" className="hover:text-slate-900 dark:hover:text-white transition-colors">PYQs</Link>
        <span>/</span>
        <Link href={`/pyq/${subject.semKey}`} className="hover:text-slate-900 dark:hover:text-white transition-colors">{subject.semTitle}</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">{subject.name}</span>
      </nav>

      {/* Subject Header */}
      <div className="glass-panel p-8 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-3 py-1 rounded-lg">
              AKTU Code: {subject.code}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-lg">
              Credits: {subject.credits}
            </span>
          </div>
          <Link
            href={`/dashboard/upload?type=pyq&subject=${subject.slug}&semester=${subject.semKey}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-3.5 py-1.5 rounded-xl hover:bg-cyber-blue hover:text-white transition-all"
          >
            <span>+ Contribute PYQ Paper</span>
          </Link>
        </div>

        <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          {subject.name} — PYQs
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Year-wise breakdown of official AKTU end-semester question papers, solved solutions, and sessional test sets for the past 5 academic years.
        </p>
      </div>

      {/* Full Empty State Banner if 0 papers exist anywhere */}
      {!hasAnyPapers && (
        <div className="glass-panel p-8 rounded-3xl text-center space-y-4 border border-dashed border-slate-300 dark:border-white/10 max-w-3xl mx-auto">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-cyber-blue/10 border border-cyber-blue/20 flex items-center justify-center text-cyber-blue text-2xl">
            📄
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              No PYQs uploaded yet for {subject.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto">
              Be the first to contribute! Select any academic year below to upload end-sem or sessional papers.
            </p>
          </div>
          <Link
            href={`/dashboard/upload?type=pyq&subject=${subject.slug}&semester=${subject.semKey}`}
            className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all"
          >
            Contribute PYQs Now ↗
          </Link>
        </div>
      )}

      {/* Exam Type Filter Bar (if papers exist) */}
      {hasAnyPapers && (
        <div className="flex items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            <span>Filter Exam Type:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "End Semester", "Sessional 1", "Sessional 2", "Model Paper"].map((exam) => (
              <button
                key={exam}
                onClick={() => setSelectedExamFilter(exam)}
                className={`text-xs px-3 py-1 rounded-lg transition-colors font-medium ${
                  selectedExamFilter === exam
                    ? "bg-cyber-blue text-white"
                    : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {exam === "ALL" ? "All Papers" : exam}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year-Wise Section Cards (5 Years: 2025-26 down to 2021-22) */}
      <div className="space-y-8">
        {DEFAULT_ACADEMIC_YEARS.map((academicYear) => {
          const yearPapers = pyqList.filter((p) => {
            const matchesYear = p.year === academicYear;
            const matchesExam = selectedExamFilter === "ALL" || p.examType === selectedExamFilter;
            return matchesYear && matchesExam;
          });

          return (
            <div key={academicYear} className="space-y-4">
              
              {/* Year Section Header */}
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 rounded-lg">
                    Academic Session {academicYear}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {yearPapers.length} {yearPapers.length === 1 ? "Paper Available" : "Papers Available"}
                  </span>
                </div>

                <Link
                  href={`/dashboard/upload?type=pyq&year=${academicYear}&subject=${subject.slug}&semester=${subject.semKey}`}
                  className="text-xs font-semibold text-cyber-blue hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>+ Upload for {academicYear}</span>
                </Link>
              </div>

              {/* Papers Grid or Year Inline Empty State */}
              {yearPapers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {yearPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="glass-panel glass-panel-hover p-6 rounded-2xl space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-cyber-indigo bg-cyber-indigo/10 border border-cyber-indigo/20 px-2.5 py-0.5 rounded uppercase">
                            {paper.examType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                              paper.isSolved
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {paper.isSolved ? "✓ Solved Paper" : "Unsolved Paper"}
                          </span>
                        </div>
                        <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {paper.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 dark:border-white/5 text-xs">
                        <span className="text-slate-500">{paper.downloads} downloads</span>
                        <a
                          href={paper.fileUrl}
                          onClick={(e) => {
                            if (paper.fileUrl === "#") {
                              e.preventDefault();
                              alert(
                                `Preview mode for ${paper.title}. Official verified PDF documents are downloadable.`
                              );
                            }
                          }}
                          className="inline-flex items-center gap-1.5 font-bold text-cyber-blue hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          <span>Download PDF</span>
                          <span>↓</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Inline Empty State Card for Missing Year */
                <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 dark:bg-[#090d16]/60 border border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-3 text-center sm:text-left">
                    <span className="text-lg">📁</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        No PYQ paper uploaded for Session {academicYear} yet
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Help your batchmates by contributing the {academicYear} exam question paper.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/upload?type=pyq&year=${academicYear}&subject=${subject.slug}&semester=${subject.semKey}`}
                    className="text-xs font-bold text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20 px-3.5 py-1.5 rounded-xl hover:bg-cyber-blue hover:text-white transition-all shrink-0"
                  >
                    + Add {academicYear} Paper
                  </Link>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}
