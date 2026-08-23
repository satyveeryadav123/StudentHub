"use client";

import { useState } from "react";
import Link from "next/link";

interface PendingUpload {
  id: string;
  title: string;
  subject: string;
  semester: string;
  contributor: string;
  size: string;
}

interface FlaggedReport {
  id: string;
  resourceTitle: string;
  reason: string;
  details: string;
  reportedBy: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"queue" | "reports" | "analytics">("queue");

  // Mock pending uploads state
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([
    { id: "upl-1", title: "Unit 3 Trees Handwritten Notes", subject: "Data Structures", semester: "Semester 3", contributor: "Aditi Sharma", size: "2.4 MB" },
    { id: "upl-2", title: "Maths-II Solved Sessional Questions 2024", subject: "Engineering Mathematics-II", semester: "Semester 2", contributor: "Rahul Verma", size: "1.8 MB" },
    { id: "upl-3", title: "DBMS Unit 4 Transactions Study Guide", subject: "Database Management Systems", semester: "Semester 4", contributor: "Priya Patel", size: "1.1 MB" },
  ]);

  // Mock flagged reports state
  const [flaggedReports, setFlaggedReports] = useState<FlaggedReport[]>([
    { id: "rep-1", resourceTitle: "Engineering Physics Unit 1 Notes", reason: "BROKEN_PDF", details: "PDF fails to load and gives 404 error", reportedBy: "Rohan Kumar" },
    { id: "rep-2", resourceTitle: "Discrete Mathematics Unit 4 Graphs QA", reason: "OUTDATED_SYLLABUS", details: "Graph coloring section has obsolete credits mapping", reportedBy: "Amit Singh" },
  ]);

  // Mock analytics dataset
  const topSubjects = [
    { name: "Data Structures & Algorithms", code: "KCS-301", views: 1420 },
    { name: "Operating Systems", code: "KCS-401", views: 980 },
    { name: "Discrete Mathematics", code: "KCS-303", views: 865 },
  ];

  const topDownloads = [
    { title: "DSA Unit 3 Notes (Trees)", type: "NOTES_PDF", count: 520 },
    { title: "Engineering Mathematics-I Solved Sessional", type: "IMPORTANT_QUESTION", count: 412 },
    { title: "Operating Systems Solved PYQ 2024", type: "NOTES_PDF", count: 350 },
  ];

  const topSearches = [
    { keyword: "dsa unit 3 notes", count: 180 },
    { keyword: "aktu maths calculus", count: 142 },
    { keyword: "os pyq 2024", count: 110 },
  ];

  // Moderation Handler
  const handleModerate = async (id: string, action: "approve" | "reject") => {
    try {
      const response = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: id, action }),
      });

      if (response.ok) {
        setPendingUploads(pendingUploads.filter((item) => item.id !== id));
        alert(`Resource successfully ${action === "approve" ? "approved" : "rejected"}!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve Reports Handler
  const handleResolveReport = (id: string) => {
    setFlaggedReports(flaggedReports.filter((item) => item.id !== id));
    alert("Report marked as resolved.");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
            Admin Moderation Console
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Approve resources, manage problem reports, and monitor student metrics.
          </p>
        </div>
        <div className="text-xs bg-rose-500/10 border border-rose-500/25 px-3 py-1 rounded-lg text-rose-600 dark:text-red-400 font-semibold tracking-wider uppercase">
          SysAdmin Portal
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/5 gap-6">
        <button
          onClick={() => setActiveTab("queue")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "queue"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          Upload Queue ({pendingUploads.length})
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "reports"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          Flagged Reports ({flaggedReports.length})
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "analytics"
              ? "border-cyber-blue text-cyber-blue"
              : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
          }`}
        >
          Portal Analytics
        </button>
      </div>

      {/* Main Console Box */}
      <div className="glass-panel p-8 rounded-3xl bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* TAB 1: Moderation Queue */}
        {activeTab === "queue" && (
          <div className="space-y-6">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-2">Pending Student Contributions</h3>
            
            {pendingUploads.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl text-xs text-slate-500">
                All contributed files have been processed. Queue is clean.
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-white/5 space-y-4">
                {pendingUploads.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        Subject: <span className="text-slate-700 dark:text-slate-300">{item.subject}</span> • Semester: <span className="text-slate-700 dark:text-slate-300">{item.semester}</span> • Size: <span className="text-slate-700 dark:text-slate-300">{item.size}</span>
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600">Contributed by: {item.contributor}</p>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto shrink-0">
                      <button
                        onClick={() => handleModerate(item.id, "reject")}
                        className="flex-1 md:flex-initial rounded-lg border border-slate-200 dark:border-white/10 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-red-400 hover:border-rose-500/25 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleModerate(item.id, "approve")}
                        className="flex-1 md:flex-initial rounded-lg bg-cyber-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/10"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Flagged Reports */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white mb-2">Student Bug/PDF Reports</h3>

            {flaggedReports.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-2xl text-xs text-slate-500">
                No open reports. All files are functional.
              </div>
            ) : (
              <div className="divide-y divide-slate-200/80 dark:divide-white/5 space-y-4">
                {flaggedReports.map((report) => (
                  <div key={report.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/25">
                          {report.reason}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{report.resourceTitle}</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-white/[0.01] p-3 rounded-lg border border-slate-200 dark:border-white/5">
                        &quot;{report.details}&quot;
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-600">Reported by: {report.reportedBy}</p>
                    </div>

                    <button
                      onClick={() => handleResolveReport(report.id)}
                      className="w-full md:w-auto shrink-0 rounded-lg border border-slate-200 dark:border-white/10 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/25 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Mark Resolved
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/5 pb-2">
              Event Analytics Dashboard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Box 1: Viewed Subjects */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  🔥 Most Viewed Subjects
                </h4>
                <ul className="space-y-3 text-xs">
                  {topSubjects.map((sub, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <div className="truncate pr-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{sub.name}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{sub.code}</div>
                      </div>
                      <span className="shrink-0 text-cyber-blue font-extrabold">{sub.views} views</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Box 2: Top Downloads */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  📥 Top Downloaded Notes
                </h4>
                <ul className="space-y-3 text-xs">
                  {topDownloads.map((dl, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <div className="truncate pr-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{dl.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{dl.type}</div>
                      </div>
                      <span className="shrink-0 text-cyber-indigo font-extrabold">{dl.count} downloads</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Box 3: Keywords */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  🔍 Top Search Terms
                </h4>
                <ul className="space-y-3 text-xs">
                  {topSearches.map((se, idx) => (
                    <li key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate italic pr-2">&quot;{se.keyword}&quot;</span>
                      <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-extrabold">{se.count} hits</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
