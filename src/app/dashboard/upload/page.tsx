"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SUBJECT_DATA } from "@/lib/subjects";

function UploadFormContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type");
  const initialSem = searchParams.get("semester") || "sem-1";
  const initialSubject = searchParams.get("subject") || "";
  const initialYear = searchParams.get("year") || "2024-25";
  const initialExamType = searchParams.get("examType") || "End Semester";

  const [title, setTitle] = useState("");
  const [type, setType] = useState(initialType?.toUpperCase() === "PYQ" || initialType?.toUpperCase() === "PYQ_PDF" ? "PYQ_PDF" : "NOTES_PDF");
  const [semester, setSemester] = useState(SUBJECT_DATA[initialSem] ? initialSem : "sem-1");

  // PYQ Specific Fields
  const [pyqYear, setPyqYear] = useState(initialYear);
  const [pyqExamType, setPyqExamType] = useState(initialExamType);

  // Get active subjects from shared source of truth
  const activeSemesterObj = SUBJECT_DATA[semester] || SUBJECT_DATA["sem-1"];
  const activeSubjects = activeSemesterObj.subjects;

  const [subjectSlug, setSubjectSlug] = useState(
    initialSubject && activeSubjects.some((s) => s.slug === initialSubject)
      ? initialSubject
      : activeSubjects[0]?.slug || ""
  );
  const [unit, setUnit] = useState("1");
  const [file, setFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialType && (initialType.toLowerCase() === "pyq" || initialType.toUpperCase() === "PYQ_PDF")) {
      setType("PYQ_PDF");
    }
  }, [initialType]);

  // Selected subject object
  const selectedSubjectObj = activeSubjects.find((s) => s.slug === subjectSlug) || activeSubjects[0];
  const maxUnits = selectedSubjectObj?.unitsCount || 5;
  const unitsList = Array.from({ length: maxUnits }, (_, i) => (i + 1).toString());

  const handleSemesterChange = (semValue: string) => {
    setSemester(semValue);
    const newSemObj = SUBJECT_DATA[semValue];
    if (newSemObj && newSemObj.subjects.length > 0) {
      setSubjectSlug(newSemObj.subjects[0].slug);
    } else {
      setSubjectSlug("");
    }
    setUnit("1");
  };

  const handleSubjectChange = (slugValue: string) => {
    setSubjectSlug(slugValue);
    setUnit("1");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setErrorMsg("Only PDF files are supported for notes and PYQs.");
        setFile(null);
        return;
      }
      setErrorMsg("");
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Please select a PDF file to upload.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("semester", semester);
    formData.append("subject", subjectSlug);
    formData.append("unit", unit);

    if (type === "PYQ_PDF") {
      formData.append("year", pyqYear);
      formData.append("examType", pyqExamType);
    }

    try {
      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMsg("Resource contributed successfully! It is now pending admin moderation.");
        setTitle("");
        setFile(null);
        // Clear input element
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        setErrorMsg(data.error || "Failed to upload resource. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error occurred during note upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Navigation Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">Contribute Material</span>
      </nav>

      {/* Form Header */}
      <div className="space-y-2">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">
          Contribute Academic Material
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Upload handwritten lecture notes, official syllabus outlines, or previous year question papers (PYQs) for AKTU engineering subjects.
        </p>
      </div>

      {/* Upload Form Card */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Resource Type Selection */}
          <div className="space-y-2">
            <label htmlFor="type" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Select Resource Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white dark:bg-[#111726] border border-cyber-blue/30 text-slate-900 dark:text-slate-100 text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-cyber-blue"
            >
              <option value="NOTES_PDF">Lecture Notes PDF</option>
              <option value="PYQ_PDF">Previous Year Question Paper (PYQ)</option>
              <option value="SYLLABUS">Syllabus Outline Guide</option>
              <option value="IMPORTANT_QUESTION">Important Sessional Questions</option>
            </select>
          </div>

          {/* Resource Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Resource Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === "PYQ_PDF" ? "e.g. 2024-25 Regular End Semester Solved Question Paper" : "e.g. Unit 1 Trees Handwritten Notes (Topper)"}
              className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Semester & Subject Selection Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="semester" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                {Object.keys(SUBJECT_DATA).map((key) => (
                  <option key={key} value={key}>
                    {SUBJECT_DATA[key].title} ({SUBJECT_DATA[key].subjects.length} Subjects)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Subject ({activeSubjects.length} Available)
              </label>
              <select
                id="subject"
                value={subjectSlug}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none truncate"
              >
                {activeSubjects.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    [{sub.code}] {sub.name} ({sub.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit selection OR PYQ Year & Exam Type Group */}
          {type === "PYQ_PDF" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-cyber-blue/5 border border-cyber-blue/20">
              <div className="space-y-2">
                <label htmlFor="pyq-year" className="text-xs font-bold text-cyber-blue">
                  Academic Session Year
                </label>
                <select
                  id="pyq-year"
                  value={pyqYear}
                  onChange={(e) => setPyqYear(e.target.value)}
                  className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none"
                >
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2022-23">2022-23</option>
                  <option value="2021-22">2021-22</option>
                  <option value="2020-21">2020-21</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="pyq-exam" className="text-xs font-bold text-cyber-blue">
                  Exam Type Category
                </label>
                <select
                  id="pyq-exam"
                  value={pyqExamType}
                  onChange={(e) => setPyqExamType(e.target.value)}
                  className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none"
                >
                  <option value="End Semester">End Semester Exam</option>
                  <option value="Sessional 1">Sessional 1 Exam</option>
                  <option value="Sessional 2">Sessional 2 Exam</option>
                  <option value="Model Paper">Model Practice Paper</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="unit" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Syllabus Unit
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                {unitsList.map((u) => (
                  <option key={u} value={u}>
                    Unit {u}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Drag and Drop / Input */}
          <div className="space-y-2">
            <label htmlFor="file-upload" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              PDF Document Upload
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-cyber-blue/40 rounded-2xl p-6 text-center bg-slate-50 dark:bg-[#111726]/50 transition-colors">
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <div className="h-12 w-12 rounded-full bg-cyber-blue/10 flex items-center justify-center text-cyber-blue text-xl">
                  📄
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {file ? (
                    <span className="text-cyber-blue font-bold">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  ) : (
                    <span>Click to browse or drop your PDF document here</span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">Supported format: PDF only (Max size: 25MB)</span>
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="w-full rounded-xl bg-cyber-blue py-3.5 text-sm font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Uploading Resource...</span>
              </>
            ) : (
              <span>Submit Resource for Moderation 🚀</span>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}

export default function ResourceUploadPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-slate-400">
        Loading upload form...
      </div>
    }>
      <UploadFormContent />
    </Suspense>
  );
}
