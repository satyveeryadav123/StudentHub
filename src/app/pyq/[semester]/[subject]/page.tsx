import { notFound } from "next/navigation";
import { Metadata } from "next";
import { findSubject } from "@/lib/subjects";
import PYQSubjectView, { PYQSubjectData } from "@/components/modules/PYQSubjectView";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ semester: string; subject: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { semester, subject } = resolvedParams;

  const result = findSubject(subject, semester);

  if (!result) {
    return { title: "PYQ Subject Not Found | StudentHub" };
  }

  const foundSubject = result.subject;

  return {
    title: `${foundSubject.name} (${foundSubject.code}) PYQ Papers | AKTU B.Tech CSE`,
    description: `Download official AKTU previous year question papers (PYQs) and sessional solutions for ${foundSubject.name} (${foundSubject.code}).`,
  };
}

export default async function PYQSubjectPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { semester, subject } = resolvedParams;

  const result = findSubject(subject, semester);
  if (!result) {
    notFound();
  }

  const { subject: foundSubject, semKey, semesterData } = result;

  const pyqSubjectData: PYQSubjectData = {
    semTitle: semesterData.title,
    semKey,
    name: foundSubject.name,
    code: foundSubject.code,
    credits: foundSubject.credits,
    slug: foundSubject.slug,
    papers: [],
  };

  return <PYQSubjectView subject={pyqSubjectData} />;
}

