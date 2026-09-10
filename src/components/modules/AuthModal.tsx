"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, signUp, signIn, openAuthModal, signOut, resetPassword } = useAuth();
  const router = useRouter();

  // Form State
  const [loginRole, setLoginRole] = useState<"student" | "admin">("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [branch, setBranch] = useState("Computer Science (CSE)");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password View State
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsForgotPassword(false);
    setErrorMsg("");
    setSuccessMsg("");
    closeAuthModal();
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const res = await resetPassword(resetEmail);
      if (res.error) {
        setErrorMsg(res.error.message || "Failed to send reset email");
      } else {
        setSuccessMsg("Check your email for reset link");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      if (authModalMode === "signup") {
        const res = await signUp(name, email, password, branch);
        if (res.success) {
          setName("");
          setEmail("");
          setPassword("");
          closeAuthModal();
          router.push("/dashboard");
          router.refresh();
        } else if (res.error) {
          setErrorMsg(res.error);
        }
      } else {
        const res = await signIn(email, password);
        if (res.success) {
          const userRole =
            res.role ||
            (res.profile?.role as string) ||
            "student";
          const isUserAdmin =
            userRole === "admin" ||
            userRole?.toLowerCase() === "admin" ||
            res.profile?.role === "admin" ||
            res.profile?.role?.toLowerCase() === "admin";

          if (loginRole === "admin" && !isUserAdmin) {
            await signOut();
            setErrorMsg("This account does not have admin access");
            return;
          }

          setEmail("");
          setPassword("");
          closeAuthModal();

          if (isUserAdmin) {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        } else if (res.error) {
          setErrorMsg(res.error);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-md bg-white dark:bg-[#090d16] border ${
        !isForgotPassword && authModalMode === "login" && loginRole === "admin"
          ? "border-rose-500/40 dark:border-rose-500/40 shadow-rose-950/20"
          : "border-slate-200 dark:border-white/10"
      } p-8 rounded-3xl shadow-2xl space-y-6 transition-colors`}>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {isForgotPassword ? (
          /* Forgot Password View */
          <div className="space-y-5">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back to Sign In</span>
            </button>

            {/* View Header */}
            <div className="space-y-1 text-center">
              <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enter your email address to receive a password reset link
              </p>
            </div>

            {/* Error Feedback */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
                {errorMsg}
              </div>
            )}

            {/* Success Feedback */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 font-semibold leading-relaxed text-center">
                {successMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. student@aktu.ac.in"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/10 focus:border-cyber-blue text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 inline-flex items-center justify-center rounded-xl py-3 text-xs font-bold text-white bg-cyber-blue hover:bg-blue-600 shadow-lg shadow-cyber-blue/20 transition-all disabled:opacity-50"
              >
                {isLoading ? "Please wait..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        ) : (
          /* Normal Sign In / Sign Up View */
          <>
            {/* Modal Header & Mode Tabs */}
            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="font-heading text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent">
                  StudentHub Portal
                </span>
                {authModalMode === "login" && loginRole === "admin" && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    Admin Mode
                  </span>
                )}
              </div>

              <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                <button
                  onClick={() => { setErrorMsg(""); setSuccessMsg(""); setIsForgotPassword(false); openAuthModal("signup"); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    authModalMode === "signup"
                      ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Create Account
                </button>
                <button
                  onClick={() => { setErrorMsg(""); setSuccessMsg(""); setIsForgotPassword(false); openAuthModal("login"); }}
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
              
              {/* Sign In Role Selection Toggle */}
              {authModalMode === "login" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Sign In As
                  </label>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <button
                      type="button"
                      onClick={() => { setLoginRole("student"); setErrorMsg(""); }}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        loginRole === "student"
                          ? "bg-cyber-blue text-white shadow-md shadow-cyber-blue/20"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>🎓</span>
                      <span>Login as Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLoginRole("admin"); setErrorMsg(""); }}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        loginRole === "admin"
                          ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>🔐</span>
                      <span>Login as Admin</span>
                    </button>
                  </div>
                </div>
              )}

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
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {authModalMode === "login" && loginRole === "admin" ? "Admin Email" : "AKTU Email / Email Address"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    authModalMode === "login" && loginRole === "admin"
                      ? "Admin Email"
                      : "e.g. student@aktu.ac.in"
                  }
                  className={`w-full bg-slate-50 dark:bg-[#111726] border ${
                    authModalMode === "login" && loginRole === "admin"
                      ? "border-rose-500/40 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-200 dark:border-white/10 focus:border-cyber-blue"
                  } text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors`}
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
                  className={`w-full bg-slate-50 dark:bg-[#111726] border ${
                    authModalMode === "login" && loginRole === "admin"
                      ? "border-rose-500/40 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30"
                      : "border-slate-200 dark:border-white/10 focus:border-cyber-blue"
                  } text-slate-900 dark:text-slate-200 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors`}
                />
              </div>

              {/* Forgot Password Link in Login Mode */}
              {authModalMode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(email);
                      setIsForgotPassword(true);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-xs text-cyber-blue hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

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
                disabled={isLoading}
                className={`w-full mt-2 inline-flex items-center justify-center rounded-xl py-3 text-xs font-bold text-white transition-all shadow-lg disabled:opacity-50 ${
                  authModalMode === "login" && loginRole === "admin"
                    ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                    : "bg-cyber-blue hover:bg-blue-600 shadow-cyber-blue/20"
                }`}
              >
                {isLoading
                  ? "Please wait..."
                  : authModalMode === "signup"
                  ? "Create Account & Sync"
                  : loginRole === "admin"
                  ? "Sign In as Admin"
                  : "Sign In to Portal"}
              </button>
            </form>

            <p className="text-[11px] text-slate-500 text-center">
              {authModalMode === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setErrorMsg(""); setSuccessMsg(""); setIsForgotPassword(false); openAuthModal("login"); }}
                    className="text-cyber-blue font-semibold hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Need a student account?{" "}
                  <button
                    onClick={() => { setErrorMsg(""); setSuccessMsg(""); setIsForgotPassword(false); openAuthModal("signup"); }}
                    className="text-cyber-blue font-semibold hover:underline"
                  >
                    Create Account
                  </button>
                </>
              )}
            </p>
          </>
        )}

      </div>
    </div>
  );
}

