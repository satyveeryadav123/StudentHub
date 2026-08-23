import { NextResponse } from "next/server";
import { SUBJECT_DATA } from "@/lib/subjects";

export interface SearchResultItem {
  name: string;
  code: string;
  semester: string;
  url: string;
  type: string;
  category: "Notes" | "PYQ";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";
    const query = rawQuery.trim().toLowerCase();

    if (!query) {
      return NextResponse.json([]);
    }

    // Clean query without hyphens/spaces for code matching (e.g., "bcc-301" -> "bcc301")
    const cleanQuery = query.replace(/[\s-]/g, "");
    const isPyqSearch = query.includes("pyq") || query.includes("paper") || query.includes("question") || query.includes("exam");

    // Analytics Log
    console.log(`[Analytics Event] Search Query: "${query}" at ${new Date().toISOString()}`);

    const results: SearchResultItem[] = [];

    // Search across all 8 semesters in shared SUBJECT_DATA
    for (const [semKey, semObj] of Object.entries(SUBJECT_DATA)) {
      for (const subject of semObj.subjects) {
        const nameLower = subject.name.toLowerCase();
        const codeLower = subject.code.toLowerCase();
        const cleanCodeLower = codeLower.replace(/[\s-]/g, "");
        const descLower = subject.desc.toLowerCase();
        const semTitleLower = semObj.title.toLowerCase();

        // Match on name, raw code, cleaned code, description, or semester title
        const isMatch =
          nameLower.includes(query) ||
          codeLower.includes(query) ||
          cleanCodeLower.includes(cleanQuery) ||
          descLower.includes(query) ||
          semTitleLower.includes(query) ||
          isPyqSearch;

        if (isMatch) {
          // Add Notes Link
          if (!isPyqSearch || results.length < 5) {
            results.push({
              name: subject.name,
              code: subject.code,
              semester: semObj.title,
              url: `/notes/${semKey}/${subject.slug}`,
              type: subject.type,
              category: "Notes",
            });
          }

          // Add PYQ Link
          results.push({
            name: `${subject.name} (PYQs)`,
            code: subject.code,
            semester: semObj.title,
            url: `/pyq/${semKey}/${subject.slug}`,
            type: subject.type,
            category: "PYQ",
          });
        }
      }
    }

    // Deduplicate and return top 10 matching results
    return NextResponse.json(results.slice(0, 10));
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
