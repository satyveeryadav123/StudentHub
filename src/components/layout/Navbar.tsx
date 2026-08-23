"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/layout/ThemeToggle";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
  { name: "PYQs", path: "/pyq" },
  { name: "Calculator", path: "/calculator" },
  { name: "Resources", path: "/resources" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, openAuthModal, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-brand-bg/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & University Tag */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-heading text-2xl font-bold tracking-tight bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                StudentHub
              </span>
            </Link>
            <span className="inline-flex items-center rounded-full bg-cyber-blue/10 px-2.5 py-0.5 text-xs font-medium text-cyber-blue border border-cyber-blue/25">
              AKTU Edition
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-cyber-blue font-semibold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Status / Theme Toggle / CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-xl bg-cyber-blue/10 border border-cyber-blue/25 px-3 py-1.5 text-xs font-semibold text-cyber-blue hover:bg-cyber-blue/20 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={signOut}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal("login")}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal("signup")}
                  className="inline-flex items-center justify-center rounded-xl bg-cyber-blue px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all hover:-translate-y-0.5"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/5 bg-white/95 dark:bg-brand-bg/95 backdrop-blur-lg transition-all duration-300" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.path ||
                (item.path !== "/" && pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-cyber-blue/10 text-cyber-blue border-l-2 border-cyber-blue"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <div className="mt-4 border-t border-slate-200 dark:border-white/5 pt-4 space-y-2">
              {isLoggedIn && user ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-cyber-blue px-3 py-1">
                    Logged in as {user.name}
                  </div>
                  <button
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-rose-500 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { openAuthModal("login"); setIsMobileMenuOpen(false); }}
                    className="w-full py-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { openAuthModal("signup"); setIsMobileMenuOpen(false); }}
                    className="w-full py-2 text-center text-sm font-bold text-white bg-cyber-blue rounded-lg shadow-lg shadow-cyber-blue/20"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

