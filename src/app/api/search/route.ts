import { NextResponse } from "next/server";
import { SUBJECT_DATA } from "@/lib/subjects";
import { createClient } from "@/lib/supabase/server";

export interface SearchResultItem {
  id: string;
  title: string;
  type: string;
  semester: number | string;
  href: string;
  source: "database" | "static";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get("q") || "";
    const query = rawQuery.trim().toLowerCase();

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const dbMapped: SearchResultItem[] = [];

    // SOURCE 1 — Supabase database (real uploaded resources)
    try {
      const supabase = await createClient();
      const { data: dbResults, error: dbError } = await supabase
        .from("resources")
        .select("id, title, type, semester, subject_slug, status")
        .eq("status", "APPROVED")
        .ilike("title", `%${query}%`)
        .limit(5);

      if (!dbError && dbResults) {
        for (const resource of dbResults) {
          const semNum = resource.semester || 1;
          const slug = resource.subject_slug || "notes";
          dbMapped.push({
            id: resource.id,
            title: resource.title,
            type: resource.type,
            semester: semNum,
            href: `/notes/sem-${semNum}/${slug}`,
            source: "database",
          });
        }
      }
    } catch (dbErr) {
      console.error("Supabase search error:", dbErr);
    }

    // SOURCE 2 — Static subjects from src/lib/subjects.ts
    const staticResults: SearchResultItem[] = [];
    const cleanQuery = query.replace(/[\s-]/g, "");

    for (const [semKey, semObj] of Object.entries(SUBJECT_DATA)) {
      const semesterNum = parseInt(semKey.replace("sem-", ""), 10) || 1;
      for (const subject of semObj.subjects) {
        const nameMatch = subject.name.toLowerCase().includes(query);
        const codeMatch = subject.code.toLowerCase().includes(query);
        const cleanCodeMatch = subject.code.toLowerCase().replace(/[\s-]/g, "").includes(cleanQuery);
        const slugMatch = subject.slug.toLowerCase().includes(query);

        if (nameMatch || codeMatch || cleanCodeMatch || slugMatch) {
          staticResults.push({
            id: subject.slug,
            title: subject.name,
            type: "SUBJECT",
            semester: semesterNum,
            href: `/notes/sem-${semesterNum}/${subject.slug}`,
            source: "static",
          });
        }
      }
    }

    // Combine both arrays, remove duplicates, return max 8 results
    const combined = [...dbMapped, ...staticResults];
    const seenHrefs = new Set<string>();
    const results: SearchResultItem[] = [];

    for (const item of combined) {
      const key = `${item.id}-${item.href}`;
      if (!seenHrefs.has(key)) {
        seenHrefs.add(key);
        results.push(item);
      }
      if (results.length >= 8) break;
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ results: [], error: "Internal Server Error" }, { status: 500 });
  }
}
