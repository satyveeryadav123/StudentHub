"use client";

import { useState } from "react";
import Link from "next/link";

const SEMESTER_SUBJECTS: Record<string, { name: string; slug: string }[]> = {
  "sem-1": [
    { name: "Engineering Mathematics-I", slug: "engineering-mathematics-1" },
    { name: "Engineering Physics", slug: "engineering-physics" },
    { name: "Programming for Problem Solving", slug: "programming-problem-solving" },
  ],
  "sem-2": [
    { name: "Engineering Mathematics-II", slug: "engineering-mathematics-2" },
    { name: "Engineering Chemistry", slug: "engineering-chemistry" },
  ],
  "sem-3": [
    { name: "Data Structures & Algorithms", slug: "data-structures-algorithms" },
    { name: "Computer Organization & Architecture", slug: "computer-organization-architecture" },
    { name: "Discrete Mathematics", slug: "discrete-mathematics" },
  ],
  "sem-4": [
    { name: "Operating Systems", slug: "operating-systems" },
    { name: "Database Management Systems", slug: "database-management-systems" },
    { name: "Theory of Automata & Formal Languages", slug: "theory-automata" },
  ],
};

export default function ResourceUploadPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("NOTES_PDF");
  const [semester, setSemester] = useState("sem-3");
  const [subject, setSubject] = useState("data-structures-algorithms");
  const [unit, setUnit] = useState("1");
  const [file, setFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const activeSubjects = SEMESTER_SUBJECTS[semester] || [];

  const handleSemesterChange = (semValue: string) => {
    setSemester(semValue);
    const subjectsForSem = SEMESTER_SUBJECTS[semValue] || [];
    if (subjectsForSem.length > 0) {
      setSubject(subjectsForSem[0].slug);
    } else {
      setSubject("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setErrorMsg("Only PDF files are supported for notes and syllabus.");
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
    formData.append("subject", subject);
    formData.append("unit", unit);

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
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-extrabold text-white">
          Contribute Notes
        </h1>
        <p className="text-sm text-slate-400">
          Upload handwritten notes, unit syllabus outlines, or PYQ papers to help fellow students.
        </p>
      </div>

      {/* Main Upload Form Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-xl bg-[#090d16]">
        
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400">
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Note Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs font-semibold text-slate-300">
              Resource Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1 Trees Handwritten Notes (Topper)"
              className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
            />
          </div>

          {/* Semester & Subject Selection Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="semester" className="text-xs font-semibold text-slate-300">
                Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="sem-1">Semester 1</option>
                <option value="sem-2">Semester 2</option>
                <option value="sem-3">Semester 3</option>
                <option value="sem-4">Semester 4</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="text-xs font-semibold text-slate-300">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                {activeSubjects.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unit & Resource Type Selection Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="unit" className="text-xs font-semibold text-slate-300">
                Syllabus Unit
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="1">Unit 1</option>
                <option value="2">Unit 2</option>
                <option value="3">Unit 3</option>
                <option value="4">Unit 4</option>
                <option value="5">Unit 5</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-xs font-semibold text-slate-300">
                Resource Type
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
              >
                <option value="NOTES_PDF">Lecture Notes PDF</option>
                <option value="SYLLABUS">Syllabus Outline Guide</option>
                <option value="IMPORTANT_QUESTION">Important Sessional Questions</option>
              </select>
            </div>
          </div>

          {/* File Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Attach PDF File
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-white/10 hover:border-cyber-blue/40 rounded-2xl cursor-pointer bg-[#111726] hover:bg-white/[0.02] transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <svg className="w-8 h-8 mb-3 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="text-xs font-bold text-slate-300">
                    {file ? file.name : "Click to select notes PDF"}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Max file size: 10MB"}
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept="application/pdf"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 text-center border border-white/10 hover:bg-white/5 rounded-xl py-3 text-xs font-semibold text-slate-300 transition-colors"
            >
              Back to Portal
            </Link>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-cyber-blue py-3 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-lg shadow-cyber-blue/20"
            >
              {isUploading ? "Uploading file..." : "Contribute Notes"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
