"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SubjectRow {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

/**
 * Official AKTU B.Tech 10-Point Absolute Grading Scale & Evaluation Scheme (CBCS Ordinance)
 * Source: Dr. A.P.J. Abdul Kalam Technical University B.Tech Curriculum Ordinance (aktu.ac.in)
 * 
 * Grade Point Mapping:
 * - O  (Outstanding: 91-100%) -> 10 Pts
 * - A+ (Excellent: 90-100%)   -> 10 Pts
 * - A  (Very Good: 80-89%)    -> 9 Pts
 * - B+ (Good: 70-79%)         -> 8 Pts
 * - B  (Above Avg: 60-69%)    -> 7 Pts
 * - C  (Average: 50-59%)      -> 6 Pts
 * - D  (Pass: 45-49%)         -> 5 Pts
 * - E  (Pass: 40-44%)         -> 4 Pts
 * - F  (Fail: <40%)           -> 0 Pts
 */
const GRADE_POINTS: Record<string, number> = {
  "O": 10,
  "A+": 10,
  "A": 9,
  "B+": 8,
  "B": 7,
  "C": 6,
  "D": 5,
  "E": 4,
  "F": 0,
};

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<"cgpa" | "sgpa" | "planner">("cgpa");

  // CGPA states (Semesters 1 to 8 - Simple Average of SGPAs)
  const [semesterSgpas, setSemesterSgpas] = useState<string[]>(Array(8).fill(""));
  const [calculatedCgpa, setCalculatedCgpa] = useState<number | null>(null);
  const [calculatedSemCount, setCalculatedSemCount] = useState<number>(0);

  /**
   * Subject SGPA states (Weighted by AKTU Official Subject Credits)
   * Official AKTU B.Tech 1st Year Chemistry Group Evaluation Scheme:
   * - Eng Chemistry: 4 Credits
   * - Eng Maths-I: 4 Credits
   * - Electronics Engg: 3 Credits
   * - Mechanical Engg: 3 Credits
   * - Soft Skills (BAS-105): 0 Credits (Non-Credit Audit Course in AKTU)
   * - Chemistry Lab: 1 Credit
   * - Electronics Lab: 1.5 Credits
   * - English Lab: 1.5 Credits
   * - Workshop Practice: 1.5 Credits
   */
  const [sgpaRows, setSgpaRows] = useState<SubjectRow[]>([
    { id: "1", name: "Engineering Chemistry", credits: 4, grade: "B" },
    { id: "2", name: "Engineering Mathematics-I", credits: 4, grade: "E" },
    { id: "3", name: "Fundamentals of Electronics Engg", credits: 3, grade: "C" },
    { id: "4", name: "Fundamentals of Mechanical Engg", credits: 3, grade: "B" },
    { id: "5", name: "Soft Skills", credits: 0, grade: "B+" },
    { id: "6", name: "Engineering Chemistry Lab", credits: 1, grade: "A" },
    { id: "7", name: "Basic Electronics Engineering Lab", credits: 1.5, grade: "A+" },
    { id: "8", name: "English Language Lab", credits: 1.5, grade: "A+" },
    { id: "9", name: "Workshop Practice Lab", credits: 1.5, grade: "A+" },
  ]);
  const [calculatedSgpa, setCalculatedSgpa] = useState<number | null>(null);

  // Target Planner states
  const [currentCgpa, setCurrentCgpa] = useState("");
  const [semestersCompleted, setSemestersCompleted] = useState("");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [remainingSemesters, setRemainingSemesters] = useState("");
  const [requiredSgpa, setRequiredSgpa] = useState<number | null>(null);
  const [plannerError, setPlannerError] = useState("");

  // Helper for CGPA semester value change
  const handleSemesterChange = (index: number, value: string) => {
    const updated = [...semesterSgpas];
    updated[index] = value;
    setSemesterSgpas(updated);
    setCalculatedCgpa(null); // Reset result when inputs change
  };

  // Check validity of an individual SGPA input
  const getSemesterError = (val: string) => {
    if (!val.trim()) return null;
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 10) {
      return "Enter a value between 0 and 10";
    }
    return null;
  };

  // Determine if CGPA calculation is enabled
  const filledSemesters = semesterSgpas.filter((val) => val.trim() !== "");
  const hasErrors = semesterSgpas.some((val) => getSemesterError(val) !== null);
  const canCalculateCgpa = filledSemesters.length > 0 && !hasErrors;

  // Calculate CGPA
  const calculateCgpa = () => {
    if (!canCalculateCgpa) return;

    const validValues = semesterSgpas
      .map((val) => parseFloat(val))
      .filter((val) => !isNaN(val) && val >= 0 && val <= 10);

    if (validValues.length === 0) return;

    const sum = validValues.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / validValues.length;
    const roundedCgpa = parseFloat(avg.toFixed(2));

    setCalculatedCgpa(roundedCgpa);
    setCalculatedSemCount(validValues.length);

    // Save CGPA to local storage list
    try {
      const stored = localStorage.getItem("studenthub_saved_calc");
      let calcs = stored ? JSON.parse(stored) : [];
      calcs.push({
        id: Date.now().toString(),
        type: "CGPA",
        score: roundedCgpa,
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem("studenthub_saved_calc", JSON.stringify(calcs));
    } catch (e) {}
  };

  // Reset CGPA Form
  const resetCgpaForm = () => {
    setSemesterSgpas(Array(8).fill(""));
    setCalculatedCgpa(null);
    setCalculatedSemCount(0);
  };

  // Calculate Subject SGPA dynamically weighted by subject credits
  useEffect(() => {
    if (sgpaRows.length === 0) {
      setCalculatedSgpa(null);
      return;
    }
    let totalCredits = 0;
    let totalPoints = 0;
    sgpaRows.forEach((row) => {
      const gp = GRADE_POINTS[row.grade] ?? 0;
      const cred = row.credits ?? 0;
      totalCredits += cred;
      totalPoints += cred * gp;
    });
    if (totalCredits > 0) {
      setCalculatedSgpa(parseFloat((totalPoints / totalCredits).toFixed(2)));
    } else {
      setCalculatedSgpa(null);
    }
  }, [sgpaRows]);

  const addSgpaRow = () => {
    const newId = (sgpaRows.length + 1).toString();
    setSgpaRows([...sgpaRows, { id: newId, name: `Subject ${newId}`, credits: 3, grade: "B+" }]);
  };

  const removeSgpaRow = (id: string) => {
    setSgpaRows(sgpaRows.filter((r) => r.id !== id));
  };

  const updateSgpaRow = (id: string, field: keyof SubjectRow, value: any) => {
    setSgpaRows(
      sgpaRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveSgpaToLocal = () => {
    if (calculatedSgpa === null) return;
    try {
      const stored = localStorage.getItem("studenthub_saved_calc");
      let calcs = stored ? JSON.parse(stored) : [];
      calcs.push({
        id: Date.now().toString(),
        type: "SGPA",
        score: calculatedSgpa,
        date: new Date().toLocaleDateString(),
      });
      localStorage.setItem("studenthub_saved_calc", JSON.stringify(calcs));
      alert("SGPA score saved to portal!");
    } catch (e) {}
  };

  // Target Planner Calculation (Simple Average Logic)
  const calculatePlanner = (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerError("");
    setRequiredSgpa(null);

    const curr = parseFloat(currentCgpa);
    const comp = parseInt(semestersCompleted);
    const targ = parseFloat(targetCgpa);
    const rem = parseInt(remainingSemesters);

    if (isNaN(curr) || isNaN(comp) || isNaN(targ) || isNaN(rem)) {
      setPlannerError("Please enter valid numbers for all input fields.");
      return;
    }

    if (curr < 0 || curr > 10 || targ < 0 || targ > 10) {
      setPlannerError("CGPA scores must be between 0.0 and 10.0.");
      return;
    }

    if (comp <= 0 || rem <= 0) {
      setPlannerError("Completed and remaining semesters must be at least 1.");
      return;
    }

    const totalSemesters = comp + rem;
    const currentPoints = curr * comp;
    const targetPoints = targ * totalSemesters;
    const requiredPoints = targetPoints - currentPoints;

    if (requiredPoints <= 0) {
      setRequiredSgpa(0.0);
      return;
    }

    const reqSgpa = parseFloat((requiredPoints / rem).toFixed(2));
    setRequiredSgpa(reqSgpa);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <section className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          CGPA & SGPA Planner
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Calculate your semester SGPA or overall cumulative CGPA according to AKTU standards.
        </p>
      </section>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/5 gap-4 justify-center">
        {(["cgpa", "sgpa", "planner"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${
              activeTab === tab
                ? "border-cyber-blue text-cyber-blue"
                : "border-transparent text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            {tab === "cgpa"
              ? "CGPA Calculator"
              : tab === "sgpa"
              ? "Subject SGPA"
              : "Target Planner"}
          </button>
        ))}
      </div>

      {/* Main Calculator Container */}
      <div className="glass-panel p-8 rounded-3xl bg-white/80 dark:bg-[#090d16] border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* TAB 1: Cumulative CGPA Calculator (Simple Average of Semesters) */}
        {activeTab === "cgpa" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-4 gap-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Cumulative CGPA Calculator</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Fill in your SGPA for each completed semester. Leave uncompleted semesters blank.
                </p>
              </div>
              {filledSemesters.length > 0 && (
                <button
                  onClick={resetCgpaForm}
                  className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors self-start sm:self-auto"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Semester 1 to 8 Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {semesterSgpas.map((val, idx) => {
                const semNum = idx + 1;
                const err = getSemesterError(val);

                return (
                  <div
                    key={semNum}
                    className={`p-4 rounded-2xl border transition-all ${
                      err
                        ? "bg-rose-500/5 border-rose-500/30"
                        : val.trim()
                        ? "bg-cyber-blue/5 border-cyber-blue/30"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
                    }`}
                  >
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      Semester {semNum} SGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="e.g. 7.50"
                      value={val}
                      onChange={(e) => handleSemesterChange(idx, e.target.value)}
                      className={`w-full bg-white dark:bg-[#111726] border text-slate-900 dark:text-slate-200 text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none transition-colors ${
                        err
                          ? "border-rose-500/50 focus:border-rose-500"
                          : "border-slate-200 dark:border-white/10 focus:border-cyber-blue"
                      }`}
                    />
                    {err && (
                      <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold mt-1.5 block">
                        {err}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action & Result Footer */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                onClick={calculateCgpa}
                disabled={!canCalculateCgpa}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold text-white transition-all shadow-lg ${
                  canCalculateCgpa
                    ? "bg-cyber-blue hover:bg-blue-600 shadow-cyber-blue/20 cursor-pointer hover:-translate-y-0.5"
                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-white/5"
                }`}
              >
                <span>Calculate CGPA</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>

              {/* Prominent CGPA Result Card */}
              {calculatedCgpa !== null && (
                <div className="w-full sm:w-auto flex items-center justify-between gap-6 bg-gradient-to-r from-cyber-blue/10 to-cyber-indigo/10 p-5 rounded-2xl border border-cyber-blue/30 shadow-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-cyber-blue uppercase tracking-wider block">
                      Calculated Cumulative CGPA
                    </span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {calculatedCgpa.toFixed(2)}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Average of {calculatedSemCount} semester{calculatedSemCount > 1 ? "s" : ""} • ~{((calculatedCgpa - 0.75) * 10).toFixed(1)}% (AKTU)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Subject SGPA Calculator (Weighted by Subject Credits) */}
        {activeTab === "sgpa" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Subject SGPA Calculator</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">Enter theory and lab subjects with their respective credits & grades per AKTU scheme.</p>
              </div>
              <button
                onClick={addSgpaRow}
                className="text-xs font-bold text-cyber-blue hover:underline"
              >
                + Add Subject
              </button>
            </div>

            <div className="space-y-3">
              {sgpaRows.map((row) => (
                <div key={row.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-200 dark:border-white/5">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateSgpaRow(row.id, "name", e.target.value)}
                    placeholder="Subject Name"
                    className="w-full sm:flex-1 bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 text-slate-900 dark:text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyber-blue"
                  />
                  <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end">
                    <select
                      value={row.credits}
                      onChange={(e) => updateSgpaRow(row.id, "credits", parseFloat(e.target.value))}
                      className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none"
                    >
                      <option value={0}>0 Credits (Audit)</option>
                      <option value={0.5}>0.5 Credits</option>
                      <option value={1}>1 Credit</option>
                      <option value={1.5}>1.5 Credits</option>
                      <option value={2}>2 Credits</option>
                      <option value={2.5}>2.5 Credits</option>
                      <option value={3}>3 Credits</option>
                      <option value={3.5}>3.5 Credits</option>
                      <option value={4}>4 Credits</option>
                      <option value={5}>5 Credits</option>
                    </select>

                    <select
                      value={row.grade}
                      onChange={(e) => updateSgpaRow(row.id, "grade", e.target.value)}
                      className="bg-white dark:bg-[#111726] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-300 text-xs rounded-lg px-3 py-2 focus:outline-none"
                    >
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <option key={g} value={g}>
                          Grade {g} ({GRADE_POINTS[g]} Pts)
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeSgpaRow(row.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-red-400 rounded-lg hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {calculatedSgpa !== null && (
              <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-cyber-blue/[0.03] p-6 rounded-2xl border border-cyber-blue/15">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Calculated Semester SGPA</h4>
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {calculatedSgpa.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Equivalent percentage: ~{((calculatedSgpa - 0.75) * 10).toFixed(1)}% (AKTU Conversion)
                  </p>
                </div>
                
                <button
                  onClick={saveSgpaToLocal}
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-cyber-blue px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/15"
                >
                  Save Score to Portal
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Target Grade Planner */}
        {activeTab === "planner" && (
          <form onSubmit={calculatePlanner} className="space-y-6">
            <div className="border-b border-slate-200/80 dark:border-white/5 pb-4">
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">Target Grade Planner</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Project the average SGPA required in remaining semesters to reach your target CGPA.</p>
            </div>

            {plannerError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {plannerError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={currentCgpa}
                  onChange={(e) => setCurrentCgpa(e.target.value)}
                  placeholder="e.g. 7.50"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Semesters Completed</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  required
                  value={semestersCompleted}
                  onChange={(e) => setSemestersCompleted(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target CGPA Goal</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  placeholder="e.g. 8.20"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Remaining Semesters</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  required
                  value={remainingSemesters}
                  onChange={(e) => setRemainingSemesters(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-white/5 focus:border-cyber-blue/50 text-slate-900 dark:text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-cyber-blue px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/15"
              >
                Project Required SGPA
              </button>

              {requiredSgpa !== null && (
                <div className="text-center sm:text-right">
                  {requiredSgpa > 10.0 ? (
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-bold bg-rose-500/10 border border-rose-500/25 px-4 py-2.5 rounded-xl">
                      Impossible! Requires average SGPA of {requiredSgpa.toFixed(2)}. Reduce target.
                    </div>
                  ) : requiredSgpa <= 0 ? (
                    <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-xl">
                      Target achieved! You do not require any higher grades.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Required Average SGPA</span>
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{requiredSgpa.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        )}

      </div>

    </div>
  );
}
