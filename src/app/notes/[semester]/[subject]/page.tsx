import Link from "next/link";
import { notFound } from "next/navigation";
import SubjectView from "@/components/modules/SubjectView";
import JsonLd from "@/components/modules/JsonLd";
import { Metadata } from "next";
import { findSubject } from "@/lib/subjects";
import { OFFICIAL_UNIT_SYLLABUS_DATABASE } from "@/lib/unitSyllabusData";

// Cache notes details at the Edge CDN for 1 hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ semester: string; subject: string }>;
}

export interface DetailedUnit {
  number: number;
  title: string;
  syllabus: string;
  resources: { id: string; title: string; type: string; fileUrl: string; downloads: number }[];
}

export interface DetailedSubject {
  name: string;
  code: string;
  credits: number;
  slug: string;
  units: DetailedUnit[];
}

// Curated Notes Database for subjects with active study materials
const DETAILED_SUBJECT_RESOURCES: Record<string, Record<number, { id: string; title: string; type: string; fileUrl: string; downloads: number }[]>> = {
  "data-structures": {
    1: [
      { id: "dsa-u1-n", title: "Unit 1 Lecture Notes (Handwritten by topper)", type: "NOTES_PDF", fileUrl: "#", downloads: 412 },
      { id: "dsa-u1-s", title: "AKTU Syllabus Outline Guide", type: "SYLLABUS", fileUrl: "#", downloads: 180 },
      { id: "dsa-u1-q", title: "Unit 1 Important Sessional Questions", type: "IMPORTANT_QUESTION", fileUrl: "#", downloads: 295 },
    ],
    2: [
      { id: "dsa-u2-n", title: "Unit 2 Lecture Notes PDF", type: "NOTES_PDF", fileUrl: "#", downloads: 350 },
      { id: "dsa-u2-q", title: "Unit 2 Frequently Asked Sessional Problems", type: "IMPORTANT_QUESTION", fileUrl: "#", downloads: 144 },
    ],
    3: [
      { id: "dsa-u3-n", title: "Unit 3 Notes (Trees, AVL, BST)", type: "NOTES_PDF", fileUrl: "#", downloads: 520 },
    ],
    4: [
      { id: "dsa-u4-n", title: "Unit 4 Graphs Notes (Dijkstra, Prims)", type: "NOTES_PDF", fileUrl: "#", downloads: 288 },
    ],
    5: [
      { id: "dsa-u5-n", title: "Unit 5 Notes (Sorting & Hashing)", type: "NOTES_PDF", fileUrl: "#", downloads: 390 },
    ],
  },
  "computer-organization-architecture": {
    1: [
      { id: "coa-u1-n", title: "Unit 1 Arithmetic Algorithms Notes", type: "NOTES_PDF", fileUrl: "#", downloads: 189 },
    ],
  },
  "engineering-chemistry": {
    1: [
      { id: "chem-u1-n", title: "Unit 1 Handwritten Revision Notes (MOT, Band Theory, LCDs)", type: "NOTES_PDF", fileUrl: "/notes/engineering-chemistry/unit-1-notes.pdf", downloads: 342 },
    ],
    2: [
      { id: "chem-u2-n", title: "Unit 2 Handwritten Revision Notes (UV-Vis, IR & 1H-NMR)", type: "NOTES_PDF", fileUrl: "/notes/engineering-chemistry/unit-2-notes.pdf", downloads: 289 },
    ],
    3: [
      { id: "chem-u3-n", title: "Unit 3 Handwritten Revision Notes (Water Chemistry & Phase Rule)", type: "NOTES_PDF", fileUrl: "/notes/engineering-chemistry/unit-3-notes.pdf", downloads: 410 },
    ],
    4: [
      { id: "chem-u4-n", title: "Unit 4 Handwritten Revision Notes (Polymers, Organometallics & FRP)", type: "NOTES_PDF", fileUrl: "/notes/engineering-chemistry/unit-4-notes.pdf", downloads: 265 },
    ],
    5: [
      { id: "chem-u5-n", title: "Unit 5 Handwritten Revision Notes (Fuels, Lubricants & Corrosion)", type: "NOTES_PDF", fileUrl: "/notes/engineering-chemistry/unit-5-notes.pdf", downloads: 378 },
    ],
  },
};

function getSubjectDetails(semKey: string, subjectSlug: string): { subjectData: DetailedSubject; resolvedSemKey: string; semTitle: string } | null {
  const result = findSubject(subjectSlug, semKey);
  if (!result) return null;

  const { subject: foundSubject, semKey: resolvedSemKey, semesterData } = result;

  // Retrieve official per-unit syllabus breakdown if available
  const officialUnits = OFFICIAL_UNIT_SYLLABUS_DATABASE[foundSubject.slug];
  const customResourcesMap = DETAILED_SUBJECT_RESOURCES[foundSubject.slug] || {};

  const maxUnits = foundSubject.unitsCount || (officialUnits ? officialUnits.length : 5);

  const units: DetailedUnit[] = Array.from({ length: maxUnits }, (_, i) => {
    const unitNum = i + 1;
    const officialUnit = officialUnits ? officialUnits.find((u) => u.number === unitNum) : null;

    const title = officialUnit?.title || `Unit ${unitNum} Syllabus & Core Modules`;
    const syllabus = officialUnit?.syllabus || `Official AKTU B.Tech Syllabus - Unit ${unitNum} for ${foundSubject.name} (${foundSubject.code}).\n\nKey Focus Areas: ${foundSubject.desc}`;
    const resources = customResourcesMap[unitNum] || [];

    return {
      number: unitNum,
      title,
      syllabus,
      resources,
    };
  });

  return {
    subjectData: {
      name: foundSubject.name,
      code: foundSubject.code,
      credits: foundSubject.credits,
      slug: foundSubject.slug,
      units,
    },
    resolvedSemKey,
    semTitle: semesterData.title,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { semester, subject } = resolvedParams;
  const details = getSubjectDetails(semester, subject);

  if (!details) {
    return {
      title: "Subject Not Found | StudentHub",
    };
  }

  const { subjectData } = details;

  return {
    title: `${subjectData.name} (${subjectData.code}) Notes & PYQs | StudentHub`,
    description: `Download AKTU ${subjectData.name} (${subjectData.code}) B.Tech engineering notes, syllabus guides, and sessional important questions.`,
    keywords: [subjectData.name, subjectData.code, "AKTU notes", "engineering notes", "syllabus"],
  };
}

export default async function SubjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { semester, subject } = resolvedParams;

  const details = getSubjectDetails(semester, subject);

  // Return standard 404 if the subject doesn't exist in AKTU curriculum
  if (!details) {
    notFound();
  }

  const { subjectData, resolvedSemKey, semTitle } = details;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Course JSON-LD Schema */}
      <JsonLd
        courseName={subjectData.name}
        courseCode={subjectData.code}
        description={`AKTU B.Tech syllabus notes and question materials for ${subjectData.name}.`}
        url={`https://studentshub-aktu.vercel.app/notes/${resolvedSemKey}/${subjectData.slug}`}
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/notes" className="hover:text-slate-900 dark:hover:text-white transition-colors">Notes</Link>
        <span>/</span>
        <Link href={`/notes/${resolvedSemKey}`} className="hover:text-slate-900 dark:hover:text-white transition-colors capitalize">
          {semTitle}
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-semibold">{subjectData.name}</span>
      </nav>

      {/* Render the Client-Side Interactive Tabs Panel */}
      <SubjectView subject={subjectData} semesterCode={resolvedSemKey} />

    </div>
  );
}

