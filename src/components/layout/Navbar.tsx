"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes" },
  { name: "Calculator", path: "/calculator" },
  { name: "Resources", path: "/resources" },
  { name: "Dashboard", path: "/dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-bg/85 backdrop-blur-md">
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
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    isActive ? "text-cyber-blue font-semibold" : "text-slate-400"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Status / CTA (For MVP, simple guest indicator) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 px-4 py-1.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              Student Portal
            </Link>
          </div>

          {/* Hamburger Mobile Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                // Close SVG Icon
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger SVG Icon
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
        <div className="md:hidden border-b border-white/5 bg-brand-bg/95 backdrop-blur-lg transition-all duration-300" id="mobile-menu">
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
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="mt-4 border-t border-white/5 pt-4">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-cyber-blue py-2 text-center text-sm font-semibold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-colors"
              >
                Go to Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
