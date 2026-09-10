import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/modules/AuthModal";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import VisitorTracker from "@/components/analytics/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudentHub | AKTU Engineering Notes, PYQs & CGPA Calculator",
  description:
    "A unified resource portal for engineering students. Access semester-wise notes, syllabus, previous year questions (PYQs), important questions, and calculate your SGPA/CGPA instantly.",
  keywords: [
    "AKTU Notes",
    "Engineering Study Materials",
    "AKTU PYQ",
    "SGPA Calculator",
    "CGPA Calculator",
    "CSE Notes",
    "Syllabus Guide",
  ],
  authors: [{ name: "StudentHub Team" }],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f0f4ff] dark:bg-brand-bg text-[#0f172a] dark:text-slate-100 selection:bg-cyber-blue/30 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <div className="relative min-h-screen flex flex-col justify-between overflow-x-clip">
              {/* Subtle global gradient background glow */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-blue/10 dark:bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />
              <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyber-indigo/10 dark:bg-cyber-indigo/10 rounded-full blur-[120px] pointer-events-none -z-10" />

              {/* Navbar */}
              <Navbar />

              {/* Main content wrapper */}
              <main className="flex-grow flex flex-col">{children}</main>

              {/* Footer */}
              <Footer />
            </div>

            {/* Global Auth Modal & Analytics Tracker */}
            <AuthModal />
            <VisitorTracker />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

