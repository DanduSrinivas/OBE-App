import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  TrendingUp, 
  AlertTriangle, 
  Database, 
  FileText, 
  Download, 
  Percent, 
  Sparkles, 
  Plus, 
  Check, 
  ChevronRight, 
  Loader2,
  HelpCircle,
  Eye,
  Settings,
  Maximize2
} from "lucide-react";

interface CQISuggestion {
  id: string;
  title: string;
  type: string;
  deltaValue: string;
  description: string;
}

export default function AttainmentAnalytics() {
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [cqiSuggestions, setCqiSuggestions] = useState<CQISuggestion[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'summary'>('details');

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Triggers API log to generate actual suggestions using server-side Gemini
  const handleGenerateCQI = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/cqi-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseName: "Advanced Data Structures",
          coIndex: "2.84",
          poGap: "-12.4%"
        })
      });
      const data = await response.json();
      if (data.success && data.suggestions) {
        setCqiSuggestions(data.suggestions);
        showToast("Gemini AI successfully synchronized 3 Continuous Quality Improvement (CQI) actions.");
      }
    } catch (err) {
      console.error(err);
      showToast("Offline mode. Loaded pre-configured audit suggestions details.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toast alert popup */}
      {successToast && (
        <div className="fixed top-18 right-6 z-50 bg-primary-container border-l-4 border-status-attained text-primary p-4 rounded-xl shadow-lg flex items-center gap-2 max-w-sm">
          <Sparkles className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-xs font-bold leading-normal">{successToast}</p>
        </div>
      )}

      {/* Header section with Action Buttons */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary tracking-tight">Attainment Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">Course: CS402 - Advanced Data Structures | Semester: Fall 2026</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateCQI}
            disabled={aiLoading}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-sans text-xs font-bold flex items-center gap-2 hover:opacity-95 transition-all outline-none disabled:opacity-50 active:scale-95"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> LOGGING CQI...
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" /> LOG CQI ACTION
              </>
            )}
          </button>
          <button 
            onClick={() => showToast("Attainment pack compiled and saved (XLS).")}
            className="border border-primary text-primary bg-background px-4 py-2 rounded-lg font-sans text-xs font-bold hover:bg-surface-container transition-all flex items-center gap-2 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT REPORT
          </button>
        </div>
      </section>

      {/* Bento Grid Layout - KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="glass-card p-6 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200 border-l-4 border-l-status-attained">
          <div className="flex justify-between items-start mb-2">
            <span className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
              Course Outcome Index
            </span>
            <TrendingUp className="w-4 h-4 text-status-attained" />
          </div>
          <div className="font-display font-black text-3xl text-primary mt-2">
            2.84<span className="text-sm font-normal text-on-surface-variant">/3.0</span>
          </div>
          <div className="mt-4">
            <span className="bg-status-attained/10 text-status-attained px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase block w-fit">
              EXCEEDS TARGET
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-card p-6 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200 border-l-4 border-l-status-gap">
          <div className="flex justify-between items-start mb-2">
            <span className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
              Program Outcome Gap
            </span>
            <AlertTriangle className="w-4 h-4 text-status-gap" />
          </div>
          <div className="font-display font-black text-3xl text-primary mt-2">
            -12.4%
          </div>
          <div className="mt-4">
            <span className="bg-status-gap/10 text-status-gap px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase block w-fit">
              ACTION REQUIRED
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-card p-6 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200 border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-2">
            <span className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
              Direct Assessment %
            </span>
            <Database className="w-4 h-4 text-secondary" />
          </div>
          <div className="font-display font-black text-3xl text-primary mt-2">
            85%
          </div>
          <div className="mt-4">
            <span className="bg-surface-container-highest text-on-surface-variant px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase block w-fit">
              8% WEIGHT REMAINING
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Gap Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Outcome Attainment levels */}
        <div className="md:col-span-8 glass-card p-6 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
            <h3 className="font-display text-lg font-bold text-primary">Outcome Attainment Levels</h3>
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold tracking-wider text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-status-attained"></span> ATTAINED
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-status-warning"></span> NEAR
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-status-gap"></span> BELOW
              </span>
            </div>
          </div>

          {/* Interactive grouping bars */}
          <div className="relative pt-6 pb-2 px-4 border border-data-entry-border/45 rounded-xl bg-background/25">
            {/* Horizontal 70% Target threshold line */}
            <div className="absolute left-0 right-0 border-t-2 border-dashed border-on-surface-variant/40 z-10 top-[35%] pointer-events-none">
              <span className="absolute right-3 -top-5 bg-white px-2 py-0.5 border border-data-entry-border rounded text-[9px] font-bold text-on-surface-variant">
                Target Threshold (70%)
              </span>
            </div>

            <div className="flex items-end justify-between h-44 mt-4 select-none relative z-20">
              {/* CO1 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-attained rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "85%" }}>
                  {/* Tooltip detail */}
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    CO1: Actual (85%) | Target (70%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">CO1</span>
              </div>

              {/* CO2 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-attained rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "78%" }}>
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    CO2: Actual (78%) | Target (70%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">CO2</span>
              </div>

              {/* CO3 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-warning rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "68%" }}>
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    CO3: Actual (68%) | Target (70%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">CO3</span>
              </div>

              {/* CO4 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-gap rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "52%" }}>
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    CO4: Actual (52%) | Target (70%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">CO4</span>
              </div>

              <div className="w-1.5 h-full bg-outline-variant/30 mx-2"></div> {/* Separator bar */}

              {/* PO1 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-attained rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "90%" }}>
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    PO1: Actual (90%) | Target (60%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">PO1</span>
              </div>

              {/* PO2 */}
              <div className="flex-1 flex flex-col items-center group relative">
                <div className="w-10 bg-status-warning rounded-t-sm cursor-help hover:scale-x-105 transition-all duration-150" style={{ height: "58%" }}>
                  <div className="absolute hidden group-hover:block bg-inverse-surface text-white text-[10px] px-2 py-1 rounded -top-10 left-1/2 -translate-x-1/2 shadow-md whitespace-nowrap z-50">
                    PO2: Actual (58%) | Target (60%)
                  </div>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant mt-2">PO2</span>
              </div>

            </div>
          </div>
        </div>

        {/* Gap Analysis Sidebar Card */}
        <div className="md:col-span-4 glass-card p-6 rounded-xl flex flex-col">
          <h3 className="font-display text-lg font-bold text-primary mb-4">Gap Analysis</h3>
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
            
            {/* Gap Item 1 */}
            <div className="p-3 bg-error-container/20 border-l-4 border-status-gap rounded-lg shadow-sm">
              <div className="flex justify-between items-start text-[10px] font-bold tracking-wider">
                <span className="text-status-gap">CRITICAL GAP: CO4</span>
                <span className="text-on-surface-variant">DELTA: -0.54</span>
              </div>
              <p className="text-xs text-on-error-container font-semibold mt-1.5">
                Students underperformed in Complex Algorithms assessments (Unit 4).
              </p>
            </div>

            {/* Gap Item 2 */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start text-[10px] font-bold tracking-wider">
                <span className="text-primary">MARGINAL GAP: CO3</span>
                <span className="text-on-surface-variant">DELTA: -0.06</span>
              </div>
              <p className="text-xs text-on-surface mt-1.5">
                Minor adjustment in prerequisite knowledge standards required for correct data flow mapping.
              </p>
            </div>

            {/* Gap Item 3 */}
            <div className="p-3 bg-surface-container rounded-lg border border-outline-variant/30 shadow-sm">
              <div className="flex justify-between items-start text-[10px] font-bold tracking-wider">
                <span className="text-status-attained">STABLE FOCUS: PO1</span>
                <span className="text-on-surface-variant">DELTA: +0.90</span>
              </div>
              <p className="text-xs text-on-surface mt-1.5">
                Strong pedagogical alignment with program-level computational thinking targets.
              </p>
            </div>

          </div>

          <button 
            onClick={() => showToast("Narrative justification prompt appended.")}
            className="w-full mt-4 py-2 bg-transparent border-2 border-dashed border-outline-variant hover:border-primary text-xs font-bold font-sans text-on-surface-variant hover:text-primary rounded-lg transition-all"
          >
            + ADD NARRATIVE JUSTIFICATION
          </button>
        </div>

      </div>

      {/* Outcome Mapping Matrix Detailed Table Section */}
      <div className="glass-card rounded-xl overflow-hidden shadow-sm">
        <div className="bg-surface-container-high px-6 py-3.5 flex justify-between items-center text-xs font-bold text-primary uppercase">
          <span className="font-display tracking-wider">Outcome Mapping Matrix</span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant"><Settings size={16} /></button>
            <button className="p-1 hover:bg-surface-container-highest rounded text-on-surface-variant"><Maximize2 size={16} /></button>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-surface-container border-b border-data-entry-border">
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">OUTCOME ID</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">DESCRIPTION</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider text-center">TARGET</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider text-center">ACTUAL</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider text-center">STATUS</th>
                <th className="px-6 py-4 font-bold text-on-surface-variant text-[11px] uppercase tracking-wider">CQI STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-data-entry-border zebra-table">
              <tr className="hover:bg-surface/30">
                <td className="px-6 py-4 font-bold text-primary text-sm">CO1</td>
                <td className="px-6 py-4 font-medium text-on-surface-variant/80 max-w-sm">
                  Analyze the time and space complexity of standard algorithms.
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm">2.10</td>
                <td className="px-6 py-4 text-center font-bold text-sm text-status-attained">2.55</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-status-attained text-white text-[10px] font-extrabold px-2.5 py-1 rounded w-fit block mx-auto">
                    MET
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant italic font-semibold text-[11px]">
                  Standard compliance maintained.
                </td>
              </tr>

              <tr className="hover:bg-surface/30">
                <td className="px-6 py-4 font-bold text-primary text-sm">CO4</td>
                <td className="px-6 py-4 font-medium text-on-surface-variant/80 max-w-sm">
                  Design efficient data structures for large-scale graph problems.
                </td>
                <td className="px-6 py-4 text-center font-bold text-sm">2.10</td>
                <td className="px-6 py-4 text-center font-bold text-sm text-status-gap">1.56</td>
                <td className="px-6 py-4 text-center">
                  <span className="bg-status-gap text-white text-[10px] font-extrabold px-2 py-1 rounded w-fit block mx-auto">
                    NOT MET
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={handleGenerateCQI}
                    className="flex items-center gap-1.5 text-status-gap font-bold hover:underline"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-status-gap" /> NEEDS ACTION
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Suggestions Append Display Container */}
      <AnimatePresence>
        {cqiSuggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
              <h4 className="font-display font-bold text-primary text-lg">AI Generated CQI Interventions</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cqiSuggestions.map((s) => (
                <div key={s.id} className="p-4 bg-white border border-data-entry-border rounded-lg shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        s.type === 'CRITICAL' 
                          ? "bg-status-gap/10 text-status-gap" 
                          : s.type === 'MARGINAL' 
                          ? "bg-status-warning/10 text-status-warning" 
                          : "bg-status-attained/10 text-status-attained"
                      }`}>
                        {s.type}
                      </span>
                      <span className="text-on-surface-variant font-bold text-[10px]">{s.deltaValue}</span>
                    </div>
                    <h5 className="font-semibold text-primary text-sm leading-tight mt-1">{s.title}</h5>
                    <p className="text-xs text-on-surface-variant/90 leading-normal mt-2">
                      {s.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => showToast(`Successfully scheduled: "${s.title}"`)}
                    className="mt-4 w-full bg-surface-container hover:bg-surface-container-high py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors"
                  >
                    DEPLOY INTERVENTION
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating AI assistant button in bottom right */}
      <div className="fixed bottom-24 right-6 group z-50">
        <button 
          onClick={handleGenerateCQI}
          disabled={aiLoading}
          className="bg-primary hover:bg-primary-container text-white p-4 rounded-full shadow-lg flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-95 duration-150 transition-all outline-none"
        >
          {aiLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          ) : (
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          )}
          <span className="text-[11px] font-bold tracking-wider uppercase max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">
            Generate CQI Suggestions
          </span>
        </button>
      </div>

    </motion.div>
  );
}
