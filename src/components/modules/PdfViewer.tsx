"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface PdfViewerProps {
  fileUrl: string;        // Supabase signed URL or public URL
  title: string;          // Document title shown in header
  resourceId?: string;    // For tracking downloads
}

interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
}

const PREDEFINED_RESPONSES: Record<string, string> = {
  topics: "Focus on the units with most marks weightage in AKTU exams: typically Unit 3 and Unit 4.",
  study: "Start with syllabus, then notes, then solve PYQs from last 3 years.",
  questions: "Check the Important Questions PDF for this unit — it covers 80% of exam questions.",
  default: "To excel in this AKTU subject, master the definitions, practice standard derivation diagrams, and solve the last 3 years' university question papers.",
};

const SUGGESTION_CHIPS = [
  { label: "Key topics", query: "What topics should I focus on?" },
  { label: "Study tips", query: "How to study this subject?" },
  { label: "Exam strategy", query: "Give me important questions" },
];

export default function PdfViewer({ fileUrl, title, resourceId }: PdfViewerProps) {
  const router = useRouter();
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const [isLoadingIframe, setIsLoadingIframe] = useState(true);
  const [hasIframeError, setHasIframeError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // AI Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "ai",
      text: `Hello! I am your AI Study Companion for "${title}". Ask me for topic weightage, study strategies, or key formulas.`,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Handle Fullscreen toggle
  const toggleFullscreen = async () => {
    if (!leftPanelRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await leftPanelRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Track download / open count analytics
  const handleDownloadClick = () => {
    if (resourceId) {
      fetch(`/api/resources/${resourceId}/download`, { method: "POST" }).catch(() => {});
    }
  };

  // AI Response handler
  const handleSend = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { id: Date.now(), sender: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      let reply = PREDEFINED_RESPONSES.default;

      if (lower.includes("topic") || lower.includes("focus") || lower.includes("weightage")) {
        reply = PREDEFINED_RESPONSES.topics;
      } else if (lower.includes("how to study") || lower.includes("tip") || lower.includes("prepare")) {
        reply = PREDEFINED_RESPONSES.study;
      } else if (lower.includes("important") || lower.includes("question") || lower.includes("exam")) {
        reply = PREDEFINED_RESPONSES.questions;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "ai", text: reply },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100 dark:bg-[#05070c]">
      
      {/* LEFT PANEL: PDF Document Viewer */}
      <div
        ref={leftPanelRef}
        className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-200 dark:bg-[#070a13] border-r border-slate-200 dark:border-white/5 relative"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 bg-white/90 dark:bg-[#090d16]/90 backdrop-blur-md px-4 py-3 shrink-0 z-10">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Back"
              aria-label="Back"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            {/* Document Title */}
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md lg:max-w-lg" title={title}>
              {title}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>

            {/* Download Button */}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={handleDownloadClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyber-blue px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-600 shadow-md shadow-cyber-blue/20 transition-all"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          </div>

        </div>

        {/* PDF Iframe Rendering Container */}
        <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden bg-slate-300 dark:bg-slate-950">
          {/* Loading Spinner */}
          {isLoadingIframe && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#070a13] z-20 space-y-3">
              <div className="h-10 w-10 border-3 border-cyber-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 animate-pulse">
                Loading PDF Document...
              </p>
            </div>
          )}

          {/* Error Message */}
          {hasIframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-[#070a13] z-30 p-6 text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Unable to display PDF in browser
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                The document could not be rendered directly. You can open or download it using the button below.
              </p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyber-blue px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all"
              >
                <span>Open Document</span>
                <span>↗</span>
              </a>
            </div>
          )}

          {/* PDF Iframe */}
          <iframe
            src={fileUrl}
            className="w-full h-full border-none"
            style={{ minHeight: "80vh" }}
            title={title}
            onLoad={() => setIsLoadingIframe(false)}
            onError={() => {
              setIsLoadingIframe(false);
              setHasIframeError(true);
            }}
          />
        </div>

      </div>

      {/* RIGHT PANEL: AI Study Companion (hidden on mobile) */}
      <div className="hidden lg:flex w-80 flex-col bg-white dark:bg-[#070a13] border-l border-slate-200 dark:border-white/5 shrink-0 h-full">
        
        {/* Section Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/80 dark:bg-[#090d16]/80 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-cyber-blue/10 border border-cyber-blue/25 text-cyber-blue flex items-center justify-center text-base shadow-sm">
            🤖
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-white font-heading">
              AI Study Companion
            </h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Exam Strategies & Key Insights
            </p>
          </div>
        </div>

        {/* Messages List (Scrollable) */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 min-h-0 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[90%] rounded-2xl p-3 leading-relaxed ${
                msg.sender === "user"
                  ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20 self-end ml-auto"
                  : "glass-panel bg-slate-100/90 dark:bg-[#0c1222] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/5 self-start mr-auto"
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
            </div>
          ))}

          {isTyping && (
            <div className="glass-panel bg-slate-100/90 dark:bg-[#0c1222] text-slate-500 border border-slate-200/80 dark:border-white/5 self-start mr-auto rounded-2xl p-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyber-blue animate-ping" />
              <span className="text-[11px]">Analyzing question...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Quick Suggestion Chips & Input */}
        <div className="p-3.5 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#090d16]/50 space-y-3 shrink-0">
          
          {/* Quick Suggestion Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {SUGGESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(chip.query)}
                className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:border-cyber-blue hover:text-cyber-blue transition-colors shadow-xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask about topics, exam tips..."
              className="flex-1 bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="bg-cyber-blue hover:bg-blue-600 disabled:opacity-40 text-white rounded-xl p-2.5 transition-all flex items-center justify-center shrink-0 shadow-sm shadow-cyber-blue/20"
              title="Send"
              aria-label="Send message"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
