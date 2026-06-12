"use client";

import { useState } from "react";
import Link from "next/link";

interface PdfViewerProps {
  fileUrl: string;
  title: string;
  subjectName: string;
  subjectUrl: string;
}

export default function PdfViewer({ fileUrl, title, subjectName, subjectUrl }: PdfViewerProps) {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    {
      sender: "ai",
      text: `Hello! I am your StudentHub study partner. Ask me any question related to the notes in "${title}". I can summarize chapters, clarify algorithms, or test your knowledge!`,
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const samplePrompts = [
    "Summarize this PDF notes",
    "List the most important formulas",
    "Generate 3 practice questions",
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response based on typical exam prompts
    setTimeout(() => {
      let aiResponse = "I can read this PDF and explain it to you. In a production environment with a connected LLM API, I would fetch relevant text chunks and provide an exact answer.";

      const lowerText = text.toLowerCase();
      if (lowerText.includes("summarize") || lowerText.includes("summary")) {
        aiResponse = `Here is a summary of the provided materials:
        1. Core Algorithms: Focuses on linear data lists, stack operations (push/pop), and postfix equations.
        2. Trees & Graphs: Details binary trees, AVL balancing, and shortest path traversals (Dijkstra).
        3. Sorting & Complexity: Explores sorting benchmarks (Quick, Merge, Heap) and time/space notations.`;
      } else if (lowerText.includes("formula") || lowerText.includes("equation")) {
        aiResponse = `Key Equations and Complexity Formulas found in these notes:
        - Big-O notations: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n).
        - Height of AVL balance tree: h <= 1.44 log2(n + 2) - 0.328.
        - Binary tree max leaf nodes: L = 2^(h-1).`;
      } else if (lowerText.includes("question") || lowerText.includes("test")) {
        aiResponse = `Practice questions generated from these unit notes:
        1. Explain the difference between linear and non-linear data structures with examples.
        2. Solve the following AVL tree rotation: Insert keys [10, 20, 30] sequentially and balance it.
        3. Compare Quick Sort and Merge Sort in terms of average and worst-case time complexity.`;
      }

      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#05070c]">
      
      {/* PDF Header Toolbar */}
      <div className="flex items-center justify-between border-b border-white/5 bg-brand-bg px-6 py-3 shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={subjectUrl}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to {subjectName}
          </Link>
          <span className="text-slate-600">|</span>
          <h1 className="text-xs font-bold text-white truncate max-w-md" title={title}>
            {title}
          </h1>
        </div>
        
        {/* Actions */}
        <a
          href={fileUrl}
          download
          className="inline-flex items-center justify-center rounded-lg bg-cyber-blue px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-md shadow-cyber-blue/10"
        >
          Download PDF
        </a>
      </div>

      {/* Main Split Pane Layout */}
      <div className="flex-grow flex flex-col lg:flex-row overflow-hidden min-h-0">
        
        {/* Left Pane: PDF Viewer */}
        <div className="flex-grow bg-slate-900 border-r border-white/5 relative h-1/2 lg:h-full">
          <iframe
            src={`${fileUrl}#toolbar=0`}
            className="w-full h-full border-none"
            title="PDF Document Viewer"
          />
        </div>

        {/* Right Pane: AI Study Partner Widget */}
        <div className="w-full lg:w-96 flex flex-col bg-[#070a13] shrink-0 h-1/2 lg:h-full">
          
          {/* AI Header */}
          <div className="p-4 border-b border-white/5 bg-[#090d16] flex items-center gap-2">
            <span className="text-lg">🤖</span>
            <div>
              <h2 className="text-xs font-bold text-white">AI Study Companion</h2>
              <p className="text-[10px] text-slate-500">Retrieval-Augmented Study Assistant</p>
            </div>
          </div>

          {/* Messages Logs Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 min-h-0 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-cyber-blue/20 text-slate-100 border border-cyber-blue/25 self-end ml-auto"
                    : "bg-white/5 text-slate-300 border border-white/5 self-start mr-auto"
                }`}
              >
                <div className="whitespace-pre-line">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="bg-white/5 text-slate-500 border border-white/5 self-start mr-auto rounded-2xl p-3 max-w-[80%] flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
                </span>
                <span>Reading notes PDF...</span>
              </div>
            )}
          </div>

          {/* Chat Control Footer */}
          <div className="p-4 border-t border-white/5 bg-[#090d16] space-y-3 shrink-0">
            {/* Quick Suggestions list */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-[10px]">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p)}
                  className="flex-shrink-0 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-2 py-1 rounded-lg border border-white/5 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Form Input Group */}
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
                placeholder="Ask about equations, code, definitions..."
                className="flex-grow bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-cyber-blue hover:bg-blue-600 text-white rounded-xl p-2.5 transition-colors flex items-center justify-center shrink-0"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
