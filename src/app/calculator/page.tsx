"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface GradeRow {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

const GRADE_POINTS: Record<string, number> = {
  "O": 10,
  "A+": 9,
  "A": 8,
  "B+": 7,
  "B": 6,
  "C": 5,
  "P": 4,
  "F": 0,
};

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<"sgpa" | "cgpa" | "planner">("sgpa");
  
  // SGPA states
  const [sgpaRows, setSgpaRows] = useState<GradeRow[]>([
    { id: "1", name: "Subject 1", credits: 4, grade: "A+" },
    { id: "2", name: "Subject 2", credits: 4, grade: "A" },
    { id: "3", name: "Subject 3", credits: 3, grade: "B+" },
    { id: "4", name: "Subject 4", credits: 3, grade: "B" },
  ]);
  const [calculatedSgpa, setCalculatedSgpa] = useState<number | null>(null);

  // CGPA states
  const [cgpaInputs, setCgpaInputs] = useState<{ sem: number; sgpa: string; credits: number; enabled: boolean }[]>([
    { sem: 1, sgpa: "", credits: 20, enabled: true },
    { sem: 2, sgpa: "", credits: 20, enabled: true },
    { sem: 3, sgpa: "", credits: 22, enabled: false },
    { sem: 4, sgpa: "", credits: 22, enabled: false },
    { sem: 5, sgpa: "", credits: 22, enabled: false },
    { sem: 6, sgpa: "", credits: 22, enabled: false },
    { sem: 7, sgpa: "", credits: 20, enabled: false },
    { sem: 8, sgpa: "", credits: 18, enabled: false },
  ]);
  const [calculatedCgpa, setCalculatedCgpa] = useState<number | null>(null);

  // Planner states
  const [currentCgpa, setCurrentCgpa] = useState("");
  const [creditsCompleted, setCreditsCompleted] = useState("");
  const [targetCgpa, setTargetCgpa] = useState("");
  const [remainingCredits, setRemainingCredits] = useState("");
  const [requiredSgpa, setRequiredSgpa] = useState<number | null>(null);
  const [plannerError, setPlannerError] = useState("");

  // Calculate SGPA dynamically
  useEffect(() => {
    let totalCredits = 0;
    let totalPoints = 0;

    sgpaRows.forEach((row) => {
      const gp = GRADE_POINTS[row.grade] ?? 0;
      totalCredits += row.credits;
      totalPoints += row.credits * gp;
    });

    if (totalCredits > 0) {
      setCalculatedSgpa(parseFloat((totalPoints / totalCredits).toFixed(2)));
    } else {
      setCalculatedSgpa(null);
    }
  }, [sgpaRows]);

  // SGPA Actions
  const addSgpaRow = () => {
    const newId = (sgpaRows.length + 1).toString();
    setSgpaRows([...sgpaRows, { id: newId, name: `Subject ${newId}`, credits: 3, grade: "B+" }]);
  };

  const removeSgpaRow = (id: string) => {
    setSgpaRows(sgpaRows.filter((r) => r.id !== id));
  };

  const updateSgpaRow = (id: string, field: keyof GradeRow, value: any) => {
    setSgpaRows(
      sgpaRows.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const saveSgpaToLocal = () => {
    if (calculatedSgpa === null) return;
    const stored = localStorage.getItem("studenthub_saved_calc");
    let calcs = [];
    if (stored) {
      try { calcs = JSON.parse(stored); } catch (e) {}
    }
    
    calcs.push({
      id: Date.now().toString(),
      type: "SGPA",
      score: calculatedSgpa,
      date: new Date().toLocaleDateString(),
    });

    localStorage.setItem("studenthub_saved_calc", JSON.stringify(calcs));
    alert("SGPA score saved to local portal!");
  };

  // CGPA Actions
  const handleCgpaRowChange = (sem: number, field: "sgpa" | "credits" | "enabled", value: any) => {
    setCgpaInputs(
      cgpaInputs.map((item) => (item.sem === sem ? { ...item, [field]: value } : item))
    );
  };

  const calculateCgpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    let valid = true;

    cgpaInputs.forEach((item) => {
      if (item.enabled) {
        const sgpaVal = parseFloat(item.sgpa);
        if (isNaN(sgpaVal) || sgpaVal < 0 || sgpaVal > 10) {
          valid = false;
        } else {
          totalPoints += sgpaVal * item.credits;
          totalCredits += item.credits;
        }
      }
    });

    if (!valid || totalCredits === 0) {
      alert("Please enter valid SGPA scores (0 to 10) for enabled semesters.");
      setCalculatedCgpa(null);
      return;
    }

    const result = parseFloat((totalPoints / totalCredits).toFixed(2));
    setCalculatedCgpa(result);

    // Save CGPA to local storage list
    const stored = localStorage.getItem("studenthub_saved_calc");
    let calcs = [];
    if (stored) {
      try { calcs = JSON.parse(stored); } catch (e) {}
    }
    calcs.push({
      id: Date.now().toString(),
      type: "CGPA",
      score: result,
      date: new Date().toLocaleDateString(),
    });
    localStorage.setItem("studenthub_saved_calc", JSON.stringify(calcs));
  };

  // Planner actions
  const calculatePlanner = (e: React.FormEvent) => {
    e.preventDefault();
    setPlannerError("");
    setRequiredSgpa(null);

    const curr = parseFloat(currentCgpa);
    const comp = parseInt(creditsCompleted);
    const targ = parseFloat(targetCgpa);
    const rem = parseInt(remainingCredits);

    if (isNaN(curr) || isNaN(comp) || isNaN(targ) || isNaN(rem)) {
      setPlannerError("Please fill out all input fields with numbers.");
      return;
    }

    if (curr < 0 || curr > 10 || targ < 0 || targ > 10) {
      setPlannerError("CGPA scores must reside between 0.0 and 10.0.");
      return;
    }

    const currentPoints = curr * comp;
    const totalCredits = comp + rem;
    const targetPoints = targ * totalCredits;
    const requiredPoints = targetPoints - currentPoints;
    
    if (requiredPoints <= 0) {
      setRequiredSgpa(0.0); // Already achieved
      return;
    }

    const reqSgpa = parseFloat((requiredPoints / rem).toFixed(2));
    setRequiredSgpa(reqSgpa);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
      
      {/* Title */}
      <section className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
          SGPA & CGPA Planner
        </h1>
        <p className="text-sm text-slate-400">
          Track semester performances and calculate targets according to AKTU grading credit systems.
        </p>
      </section>

      {/* Tabs Menu */}
      <div className="flex border-b border-white/5 gap-4 justify-center">
        {(["sgpa", "cgpa", "planner"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all capitalize ${
              activeTab === tab
                ? "border-cyber-blue text-cyber-blue"
                : "border-transparent text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab === "planner" ? "Target Planner" : `${tab.toUpperCase()} Calculator`}
          </button>
        ))}
      </div>

      {/* Main calculator container */}
      <div className="glass-panel p-8 rounded-3xl bg-[#090d16] border border-white/10 shadow-2xl">
        
        {/* TAB 1: SGPA Calculator */}
        {activeTab === "sgpa" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="font-heading text-lg font-bold text-white">Semester SGPA Calculator</h3>
              <button
                onClick={addSgpaRow}
                className="text-xs font-bold text-cyber-blue hover:underline"
              >
                + Add Subject Row
              </button>
            </div>

            <div className="space-y-3">
              {sgpaRows.map((row) => (
                <div key={row.id} className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) => updateSgpaRow(row.id, "name", e.target.value)}
                    className="w-full sm:flex-grow bg-[#111726] border border-white/5 text-slate-200 text-xs rounded-lg px-3 py-2"
                  />
                  <div className="flex gap-4 w-full sm:w-auto shrink-0">
                    {/* Credits */}
                    <div className="flex-1 sm:flex-none">
                      <select
                        value={row.credits}
                        onChange={(e) => updateSgpaRow(row.id, "credits", parseInt(e.target.value))}
                        className="w-full bg-[#111726] border border-white/5 text-slate-200 text-xs rounded-lg px-3 py-2"
                      >
                        <option value="1">1 Credit</option>
                        <option value="2">2 Credits</option>
                        <option value="3">3 Credits</option>
                        <option value="4">4 Credits</option>
                        <option value="5">5 Credits</option>
                      </select>
                    </div>
                    {/* Grade */}
                    <div className="flex-1 sm:flex-none">
                      <select
                        value={row.grade}
                        onChange={(e) => updateSgpaRow(row.id, "grade", e.target.value)}
                        className="w-full bg-[#111726] border border-white/5 text-slate-200 text-xs rounded-lg px-3 py-2"
                      >
                        {Object.keys(GRADE_POINTS).map((g) => (
                          <option key={g} value={g}>
                            Grade {g} ({GRADE_POINTS[g]} Pts)
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Delete */}
                    <button
                      onClick={() => removeSgpaRow(row.id)}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations metrics */}
            {calculatedSgpa !== null && (
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-cyber-blue/[0.03] p-6 rounded-2xl">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs text-slate-400 font-semibold uppercase">Calculated SGPA</h4>
                  <div className="text-4xl font-extrabold text-white tracking-tight">
                    {calculatedSgpa}
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

        {/* TAB 2: CGPA Calculator */}
        {activeTab === "cgpa" && (
          <div className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-white border-b border-white/5 pb-4">
              Cumulative CGPA Calculator
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cgpaInputs.map((item) => (
                <div key={item.sem} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) => handleCgpaRowChange(item.sem, "enabled", e.target.checked)}
                      className="rounded border-white/10 text-cyber-blue focus:ring-cyber-blue"
                    />
                    <span className="text-xs font-semibold text-slate-300">Sem {item.sem}</span>
                  </div>
                  <div className="flex items-center gap-3 w-40">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="SGPA"
                      disabled={!item.enabled}
                      value={item.sgpa}
                      onChange={(e) => handleCgpaRowChange(item.sem, "sgpa", e.target.value)}
                      className="w-full bg-[#111726] border border-white/5 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none disabled:opacity-30"
                    />
                    <input
                      type="number"
                      placeholder="Credits"
                      disabled={!item.enabled}
                      value={item.credits}
                      onChange={(e) => handleCgpaRowChange(item.sem, "credits", parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#111726] border border-white/5 text-slate-200 text-xs text-center rounded-lg py-1.5 focus:outline-none disabled:opacity-30"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                onClick={calculateCgpa}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-cyber-blue px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/15"
              >
                Calculate CGPA
              </button>
              
              {calculatedCgpa !== null && (
                <div className="space-y-1 text-center sm:text-right">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Resulting CGPA</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight">{calculatedCgpa}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Target Grade Planner */}
        {activeTab === "planner" && (
          <form onSubmit={calculatePlanner} className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-white border-b border-white/5 pb-4">
              Target SGPA Planner
            </h3>

            {plannerError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-xs text-rose-400">
                {plannerError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={currentCgpa}
                  onChange={(e) => setCurrentCgpa(e.target.value)}
                  placeholder="e.g. 7.92"
                  className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Credits Completed</label>
                <input
                  type="number"
                  required
                  value={creditsCompleted}
                  onChange={(e) => setCreditsCompleted(e.target.value)}
                  placeholder="e.g. 42"
                  className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Target CGPA Goal</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  placeholder="e.g. 8.50"
                  className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Remaining Sem Credits</label>
                <input
                  type="number"
                  required
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(e.target.value)}
                  placeholder="e.g. 22"
                  className="w-full bg-[#111726] border border-white/5 focus:border-cyber-blue/50 text-slate-200 text-sm rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-cyber-blue px-6 py-3 text-xs font-semibold text-white hover:bg-blue-600 transition-colors shadow-lg shadow-cyber-blue/15"
              >
                Project Required SGPA
              </button>

              {requiredSgpa !== null && (
                <div className="text-center sm:text-right">
                  {requiredSgpa > 10.0 ? (
                    <div className="text-xs text-rose-400 font-bold bg-rose-500/10 border border-rose-500/25 px-4 py-2 rounded-xl">
                      Impossible! Requires an SGPA of {requiredSgpa}. Reduce target.
                    </div>
                  ) : requiredSgpa <= 0 ? (
                    <div className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/25 px-4 py-2 rounded-xl">
                      Goal achieved! You do not require any more grades.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Required average SGPA</span>
                      <span className="text-3xl font-extrabold text-white tracking-tight">{requiredSgpa}</span>
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
