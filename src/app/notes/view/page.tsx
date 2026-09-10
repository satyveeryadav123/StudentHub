import Link from "next/link";
import PdfViewer from "@/components/modules/PdfViewer";

interface ViewNotesPageProps {
  searchParams: Promise<{
    url?: string;
    title?: string;
    resourceId?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function ViewNotesPage({ searchParams }: ViewNotesPageProps) {
  const params = await searchParams;

  const url = params.url;
  const title = params.title || "Study Material Notes PDF";
  const resourceId = params.resourceId;

  if (!url) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl bg-white/85 dark:bg-[#090d16]/90 border border-slate-200 dark:border-white/10 shadow-2xl max-w-md w-full text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-3xl">
            📄
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              No document selected
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Please select a unit notes PDF or previous year question paper from the subject curriculum directory to view.
            </p>
          </div>
          <Link
            href="/notes"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-blue px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyber-blue/20 hover:bg-blue-600 transition-all"
          >
            <span>←</span>
            <span>Back to Notes Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <PdfViewer
      fileUrl={url}
      title={title}
      resourceId={resourceId}
    />
  );
}
