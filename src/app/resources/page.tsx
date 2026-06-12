import Link from "next/link";

const RESUME_TEMPLATES = [
  {
    title: "ATS-Friendly LaTeX Template",
    desc: "The standard single-column Deedy/Jake's style LaTeX code preferred by tech recruiters at Google, Microsoft, and Amazon. Overleaf-ready.",
    linkText: "Get Overleaf Code",
    tag: "LaTeX",
  },
  {
    title: "Deedy Single-Column Word Doc",
    desc: "A clean, minimal, easily editable Microsoft Word format structured specifically for parsing software like Workday and Taleo.",
    linkText: "Download DOCX",
    tag: "MS Word",
  },
];

const PLACEMENT_SECTIONS = [
  {
    title: "Data Structures & Algorithms",
    icon: "💻",
    items: [
      { name: "Top 75 Blind DSA Sheet", desc: "Curated lists of essential LeetCode topics." },
      { name: "Dynamic Programming Cheat Sheet", desc: "Standard patterns for knapsack, LCS, and grids." },
      { name: "SDE Sheet Solutions", desc: "Step-by-step code solutions in C++, Java, and Python." },
    ],
  },
  {
    title: "CS Core Fundamentals",
    icon: "⚙️",
    items: [
      { name: "Operating Systems Quick Guide", desc: "Paging, thrashing, CPU scheduling algorithms." },
      { name: "SQL Query Master Sheet", desc: "Joins, aggregations, subqueries, and normalizations." },
      { name: "Computer Networks revision", desc: "OSI model layers, TCP/UDP headers, and DNS protocols." },
    ],
  },
  {
    title: "System Design Blueprint",
    icon: "🏗️",
    items: [
      { name: "High-Level Design Basics", desc: "Load balancers, sharding, caching, and CDN architectures." },
      { name: "Low-Level Design Examples", desc: "Design parking lot, library, and ticket bookings." },
    ],
  },
];

export default function CareerResourcesPage() {
  const trackDownload = (title: string) => {
    console.log(`[Analytics Event] Career Resource Clicked: "${title}"`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      
      {/* Title & Introduction */}
      <section className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-cyber-indigo/10 px-3 py-1 text-xs font-semibold text-cyber-indigo border border-cyber-indigo/20">
          💼 Placement Season Prep Hub
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Career & Placement Resources
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Prepare for technical interviews and ATS resume screens. Download curated materials and DSA worksheets optimized for software engineering roles.
        </p>
      </section>

      {/* Grid Split: Left: Resumes, Right: Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Resumes (1 Column) */}
        <div className="space-y-6 lg:col-span-1">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <span>📝</span> ATS Resume Vault
          </h2>
          
          <div className="space-y-4">
            {RESUME_TEMPLATES.map((res, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-indigo/5 rounded-full blur-xl -z-10" />
                <span className="text-[10px] font-bold text-cyber-indigo uppercase tracking-wider bg-cyber-indigo/10 border border-cyber-indigo/25 px-2 py-0.5 rounded">
                  {res.tag}
                </span>
                <h3 className="font-heading text-base font-bold text-white mt-3 mb-1">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {res.desc}
                </p>
                <a
                  href="#"
                  onClick={() => trackDownload(res.title)}
                  className="inline-flex items-center justify-center w-full rounded-xl bg-white/5 hover:bg-cyber-indigo hover:text-white border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition-all"
                >
                  {res.linkText}
                </a>
              </div>
            ))}
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-cyber-indigo">
            <h4 className="text-xs font-bold text-white mb-1">Pro Tip for Freshers:</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Always keep resumes on a single page. Quantify project impact (e.g., &quot;optimized DB search query, reducing load times by 30%&quot;) to score high in automated parsers.
            </p>
          </div>
        </div>

        {/* Right Side: Coding and Technical sheets (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <span>📚</span> SDE Technical Checklist
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PLACEMENT_SECTIONS.map((section, sIdx) => (
              <div
                key={sIdx}
                className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="font-heading text-base font-bold text-white">
                    {section.title}
                  </h3>
                </div>

                <ul className="space-y-3">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <a
                        href="#"
                        onClick={() => trackDownload(item.name)}
                        className="group block"
                      >
                        <h4 className="text-xs font-bold text-slate-300 group-hover:text-cyber-blue transition-colors flex items-center justify-between">
                          <span>{item.name}</span>
                          <span className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {item.desc}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
