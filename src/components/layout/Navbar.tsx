"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/layout/ThemeToggle";

const BASE_NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
  { name: "PYQs", path: "/pyq" },
  { name: "Calculator", path: "/calculator" },
  { name: "Resources", path: "/resources" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, profile, isLoggedIn, isAdmin, openAuthModal, signOut } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    ...BASE_NAV_ITEMS,
    ...(isLoggedIn
      ? isAdmin
        ? [{ name: "Admin Panel", path: "/admin" }]
        : [{ name: "Dashboard", path: "/dashboard" }]
      : []),
    { name: "About", path: "/about" },
  ];

  const destinationHref = isAdmin ? "/admin" : "/dashboard";
  const displayName =
    profile?.full_name?.trim() ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "Student");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-brand-bg/85 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & University Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={() => { setIsMobileMenuOpen(false); setIsUserDropdownOpen(false); }}
              className="flex items-center gap-2 group"
            >
              <span className="font-heading text-2xl font-bold tracking-tight bg-gradient-to-r from-cyber-blue to-cyber-indigo bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                StudentHub
              </span>
            </Link>
            <span className="inline-flex items-center rounded-full bg-cyber-blue/10 px-2.5 py-0.5 text-xs font-medium text-cyber-blue border border-cyber-blue/25">
              AKTU Edition
            </span>
          </div>

          {/* Desktop Navigation (visible only on lg and above) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => {
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

          {/* Desktop User Status / Theme Toggle / CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {isLoggedIn && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserDropdownOpen((prev) => !prev)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                    isAdmin
                      ? "bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                      : "bg-cyber-blue/10 border-cyber-blue/25 text-cyber-blue hover:bg-cyber-blue/20"
                  }`}
                  aria-expanded={isUserDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className={`h-2 w-2 rounded-full ${isAdmin ? "bg-rose-500 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-600 dark:text-rose-300">
                      Admin
                    </span>
                  )}
                  <svg className={`h-3.5 w-3.5 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="glass-panel absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-[#090d16]/95 border border-slate-200/80 dark:border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyber-blue transition-colors"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href={destinationHref}
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-cyber-blue transition-colors"
                    >
                      <span>📊</span>
                      <span>{isAdmin ? "Admin Panel" : "Dashboard"}</span>
                    </Link>

                    <div className="my-1 border-t border-slate-200/80 dark:border-white/5" />

                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
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

          {/* Mobile Right Controls: Theme Toggle + Hamburger (visible below lg) */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              type="button"
              className="inline-flex items-center justify-center rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white focus:outline-none transition-colors border border-slate-200/80 dark:border-white/5"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Toggle navigation menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden w-full border-b border-slate-200/80 dark:border-white/5 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-fadeIn"
          id="mobile-menu"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 space-y-3">
            
            {/* Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.path ||
                  (item.path !== "/" && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-cyber-blue/10 text-cyber-blue border-l-4 border-cyber-blue"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="text-xs text-cyber-blue font-bold">●</span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Auth Section */}
            <div className="pt-3 border-t border-slate-200/80 dark:border-white/5 space-y-2.5">
              {isLoggedIn && user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${isAdmin ? "bg-rose-500 animate-pulse" : "bg-emerald-400 animate-pulse"}`} />
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {displayName}
                      </span>
                    </div>
                    {isAdmin && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:text-cyber-blue transition-colors"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href={destinationHref}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isAdmin
                          ? "bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400"
                          : "bg-cyber-blue/10 border border-cyber-blue/25 text-cyber-blue"
                      }`}
                    >
                      <span>📊</span>
                      <span>{isAdmin ? "Admin Panel" : "Dashboard"}</span>
                    </Link>
                  </div>

                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-center border border-rose-500/20"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={() => {
                      openAuthModal("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      openAuthModal("signup");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-white bg-cyber-blue hover:bg-blue-600 rounded-xl shadow-lg shadow-cyber-blue/20 transition-all"
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

