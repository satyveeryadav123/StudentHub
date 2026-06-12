import PdfViewer from "@/components/modules/PdfViewer";
import { redirect } from "next/navigation";

interface SearchProps {
  searchParams: Promise<{
    url?: string;
    title?: string;
    subject?: string;
    subjectUrl?: string;
  }>;
}

export default async function ViewNotesPage({ searchParams }: SearchProps) {
  const params = await searchParams;
  
  const url = params.url;
  const title = params.title || "Syllabus Notes PDF";
  const subjectName = params.subject || "Data Structures";
  const subjectUrl = params.subjectUrl || "/notes";

  // If there's no URL param, default to standard test PDF so the viewer doesn't crash
  const targetPdfUrl = url || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <PdfViewer
      fileUrl={targetPdfUrl}
      title={title}
      subjectName={subjectName}
      subjectUrl={subjectUrl}
    />
  );
}
