"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, signUp, signIn, openAuthModal } = useAuth();
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("Computer Science (CSE)");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (authModalMode === "signup") {
      const res = signUp(name, email, password, branch);
      if (res.success) {
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } else {
      const res = signIn(email, password);
      if (res.success) {
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#090d16] border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header & Mode Tabs */}
        <div className="space-y-4 text-center">
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
            StudentHub Portal
          </span>

          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => { setErrorMsg(""); openAuthModal("signup"); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authModalMode === "signup"
                  ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => { setErrorMsg(""); openAuthModal("login"); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                authModalMode === "login"
                  ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {authModalMode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Verma"
                className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">AKTU Email / Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@aktu.ac.in"
              className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none"
            />
          </div>

          {authModalMode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Engineering Discipline / Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                <option value="Mechanical Engineering (ME)">Mechanical Engineering (ME)</option>
                <option value="Civil Engineering (CE)">Civil Engineering (CE)</option>
                <option value="Electrical Engineering (EE)">Electrical Engineering (EE)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center rounded-xl bg-cyber-blue py-3 text-xs font-bold text-white hover:bg-blue-600 transition-all shadow-lg shadow-cyber-blue/20"
          >
            {authModalMode === "signup" ? "Create Account & Sync" : "Sign In to Portal"}
          </button>
        </form>

        <p className="text-[11px] text-slate-500 text-center">
          {authModalMode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => { setErrorMsg(""); openAuthModal("login"); }}
                className="text-cyber-blue font-semibold hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Need a student account?{" "}
              <button
                onClick={() => { setErrorMsg(""); openAuthModal("signup"); }}
                className="text-cyber-blue font-semibold hover:underline"
              >
                Create Account
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}
