"use client";

import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resourceId: string;
  resourceTitle: string;
}

export default function ReportModal({ isOpen, onClose, resourceId, resourceTitle }: ReportModalProps) {
  const [reason, setReason] = useState("BROKEN_PDF");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId,
          reason,
          description,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setDescription("");
          onClose();
        }, 2000);
      } else {
        setErrorMsg(data.error || "Failed to submit report. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Failed to submit report:", err);
      setErrorMsg("Network error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#090d16]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitSuccess ? (
          <div className="text-center py-8 space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/25">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Report Submitted</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Thank you. Our moderators have been notified and will verify this link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Report Resource</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Resource: <span className="text-slate-800 dark:text-slate-200 font-semibold">{resourceTitle}</span>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Select Reason */}
            <div className="space-y-2">
              <label htmlFor="reason" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                What is the issue?
              </label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-2.5 focus:outline-none"
              >
                <option value="BROKEN_PDF">Broken PDF / Dead Link</option>
                <option value="INCORRECT_RESOURCE">Incorrect Resource (Wrong Subject/Unit)</option>
                <option value="OUTDATED_SYLLABUS">Outdated Syllabus Contents</option>
                <option value="OTHER">Other Issue</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Additional Details
              </label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the issue (e.g. page 4 is missing, notes are for different code)..."
                className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-xs rounded-xl p-3 focus:outline-none resize-none placeholder-slate-400 dark:placeholder-slate-600"
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-xl bg-cyber-blue px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 disabled:opacity-50 transition-colors shadow-lg shadow-cyber-blue/20"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
