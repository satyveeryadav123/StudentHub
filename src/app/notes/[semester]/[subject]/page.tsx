import Link from "next/link";
import { notFound } from "next/navigation";
import SubjectView from "@/components/modules/SubjectView";
import JsonLd from "@/components/modules/JsonLd";
import { Metadata } from "next";

// Cache notes details at the Edge CDN for 1 hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ semester: string; subject: string }>;
}

// Structured Mock Database for B.Tech Subject Syllabus & Note Resources
const SUBJECTS_DETAIL_DATABASE: Record<
  string,
  {
    name: string;
    code: string;
    credits: number;
    slug: string;
    units: {
      number: number;
      title: string;
      syllabus: string;
      resources: { id: string; title: string; type: string; fileUrl: string; downloads: number }[];
    }[];
  }
> = {
  "data-structures-algorithms": {
    name: "Data Structures & Algorithms",
    code: "KCS-301",
    credits: 4,
    slug: "data-structures-algorithms",
    units: [
      {
        number: 1,
        title: "Complexity & Linear Lists",
        syllabus: "Asymptotic Notations (Big-Oh, Theta, Omega), time and space complexity analysis.\nSingle, double, and circular linked lists implementation.\nOperations on lists: Insertion, deletion, reversal.",
        resources: [
          { id: "dsa-u1-n", title: "Unit 1 Lecture Notes (Handwritten by topper)", type: "NOTES_PDF", fileUrl: "#", downloads: 412 },
          { id: "dsa-u1-s", title: "AKTU Syllabus Outline Guide", type: "SYLLABUS", fileUrl: "#", downloads: 180 },
          { id: "dsa-u1-q", title: "Unit 1 Important Sessional Questions", type: "IMPORTANT_QUESTION", fileUrl: "#", downloads: 295 },
        ],
      },
      {
        number: 2,
        title: "Stacks and Queues",
        syllabus: "Stack ADT, array and linked list representation.\nPrefix, infix, and postfix expression evaluation.\nQueue structures: Linear queues, circular queues, dequeues.",
        resources: [
          { id: "dsa-u2-n", title: "Unit 2 Lecture Notes PDF", type: "NOTES_PDF", fileUrl: "#", downloads: 350 },
          { id: "dsa-u2-q", title: "Unit 2 Frequently Asked Sessional Problems", type: "IMPORTANT_QUESTION", fileUrl: "#", downloads: 144 },
        ],
      },
      {
        number: 3,
        title: "Trees and Binary Trees",
        syllabus: "General trees, binary trees, binary tree traversal algorithms (inorder, preorder, postorder).\nBinary Search Trees (BST): insertion, deletion, searching.\nAVL trees: rotations, height balancing mechanisms.",
        resources: [
          { id: "dsa-u3-n", title: "Unit 3 Notes (Trees, AVL, BST)", type: "NOTES_PDF", fileUrl: "#", downloads: 520 },
        ],
      },
      {
        number: 4,
        title: "Graphs",
        syllabus: "Graph representations: Adjacency list and adjacency matrices.\nTraversal: Breadth First Search (BFS), Depth First Search (DFS).\nMinimum Spanning Trees (MST): Prim's and Kruskal's algorithms.\nShortest Path Algorithms: Dijkstra's algorithm.",
        resources: [
          { id: "dsa-u4-n", title: "Unit 4 Graphs Notes (Dijkstra, Prims)", type: "NOTES_PDF", fileUrl: "#", downloads: 288 },
        ],
      },
      {
        number: 5,
        title: "Searching & Sorting",
        syllabus: "Internal and external sorting techniques.\nComparison-based sorting: Bubble, Insertion, Selection, Merge, Quick, and Heap sort.\nHashing: Collision resolution, open addressing, chaining.",
        resources: [
          { id: "dsa-u5-n", title: "Unit 5 Notes (Sorting & Hashing)", type: "NOTES_PDF", fileUrl: "#", downloads: 390 },
        ],
      },
    ],
  },
  "computer-organization-architecture": {
    name: "Computer Organization & Architecture",
    code: "KCS-302",
    credits: 4,
    slug: "computer-organization-architecture",
    units: [
      {
        number: 1,
        title: "Introduction & Arithmetic Algorithms",
        syllabus: "Functional blocks of a computer: CPU, memory, input/output.\nFloating point representation, IEEE standard, Booth's multiplication, division algorithms.",
        resources: [
          { id: "coa-u1-n", title: "Unit 1 Arithmetic Algorithms Notes", type: "NOTES_PDF", fileUrl: "#", downloads: 189 },
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { subject } = resolvedParams;
  const subjectData = SUBJECTS_DETAIL_DATABASE[subject.toLowerCase()];

  if (!subjectData) {
    return {
      title: "Subject Not Found | StudentHub",
    };
  }

  return {
    title: `${subjectData.name} (${subjectData.code}) Notes & PYQs | StudentHub`,
    description: `Download AKTU ${subjectData.name} (${subjectData.code}) B.Tech engineering notes, syllabus guides, and sessional important questions.`,
    keywords: [subjectData.name, subjectData.code, "AKTU notes", "engineering notes", "syllabus"],
  };
}

export default async function SubjectDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { semester, subject } = resolvedParams;

  const subjectData = SUBJECTS_DETAIL_DATABASE[subject.toLowerCase()];

  // Return standard 404 if the subject doesn't exist
  if (!subjectData) {
    notFound();
  }

  // Capitalize semester path for display breadcrumb
  const formattedSemTitle = semester.replace("-", " ").toUpperCase();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Course JSON-LD Schema */}
      <JsonLd
        courseName={subjectData.name}
        courseCode={subjectData.code}
        description={`AKTU B.Tech syllabus notes and question materials for ${subjectData.name}.`}
        url={`https://studentshub-aktu.vercel.app/notes/${semester}/${subject}`}
      />
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/notes" className="hover:text-white transition-colors">Notes</Link>
        <span>/</span>
        <Link href={`/notes/${semester}`} className="hover:text-white transition-colors capitalize">
          {formattedSemTitle}
        </Link>
        <span>/</span>
        <span className="text-slate-300 font-semibold">{subjectData.name}</span>
      </nav>

      {/* Render the Client-Side Interactive Tabs Panel */}
      <SubjectView subject={subjectData} semesterCode={semester} />

    </div>
  );
}

