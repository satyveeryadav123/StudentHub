import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
};

export default function RootLayout({
  children,
  childrenContent,
}: Readonly<{
  children: React.ReactNode;
  childrenContent?: React.ReactNode;
}>) {
  // Use children or childrenContent if available
  const content = children || childrenContent;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-slate-100 selection:bg-cyber-blue/30 selection:text-white">
        <div className="relative min-h-screen flex flex-col justify-between">
          {/* Subtle global gradient background glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyber-indigo/10 rounded-full blur-[120px] pointer-events-none -z-10" />

          {/* Navbar */}
          <Navbar />

          {/* Main content wrapper */}
          <main className="flex-grow flex flex-col">{content}</main>

          {/* Footer */}
          <Footer />
        </div>
      </body>
    </html>
  );
}

