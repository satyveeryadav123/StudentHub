import { NextResponse } from "next/server";

// Mock dataset for search autocomplete until database connection is completed
const MOCK_SEARCH_DATA = [
  {
    type: "subject",
    name: "Data Structures & Algorithms",
    code: "KCS-301",
    url: "/notes/sem-3/data-structures-algorithms",
    keywords: "dsa data structures algorithms trees graphs stacks queues sem 3 third",
  },
  {
    type: "subject",
    name: "Computer Organization & Architecture",
    code: "KCS-302",
    url: "/notes/sem-3/computer-organization-architecture",
    keywords: "coa computer organization architecture registers cpu pipeline cache sem 3 third",
  },
  {
    type: "subject",
    name: "Operating Systems",
    code: "KCS-401",
    url: "/notes/sem-4/operating-systems",
    keywords: "os operating systems scheduling threads deadlocks memory management sem 4 fourth",
  },
  {
    type: "subject",
    name: "Database Management Systems",
    code: "KCS-402",
    url: "/notes/sem-4/database-management-systems",
    keywords: "dbms database management SQL normalization indexing transactions sem 4 fourth",
  },
  {
    type: "subject",
    name: "Engineering Mathematics-I",
    code: "KAS-103",
    url: "/notes/sem-1/engineering-mathematics-1",
    keywords: "maths calculus matrices differential equations vector calculus sem 1 first",
  },
  {
    type: "subject",
    name: "Engineering Physics",
    code: "KAS-101",
    url: "/notes/sem-1/engineering-physics",
    keywords: "physics optics wave mechanics electromagnetism lasers fiber optics sem 1 first",
  },
  {
    type: "resource",
    name: "DSA Unit 3 Notes (Trees & Binary Trees)",
    url: "/notes/sem-3/data-structures-algorithms?unit=3",
    keywords: "dsa unit 3 trees binary search trees AVL nodes",
  },
  {
    type: "resource",
    name: "Operating Systems Solved PYQs (2024 Exam)",
    url: "/notes/sem-4/operating-systems?resource=pyq-2024",
    keywords: "os pyq previous year questions paper 2024 solutions",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json([]);
    }

    // Keyword Tracker Analytics (Logged to server console in dev/MVP)
    console.log(`[Analytics Event] Keyword Searched: "${query}" at ${new Date().toISOString()}`);

    // Perform simple fuzzy match across names, codes, and keyword tags
    const filteredResults = MOCK_SEARCH_DATA.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.code?.toLowerCase().includes(query) ||
        item.keywords.includes(query)
    ).slice(0, 5); // Cap results at 5 for quick drop-down views

    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
