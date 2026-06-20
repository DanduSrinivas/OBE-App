import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ChevronRight, 
  Send, 
  Save, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Edit, 
  Trash2, 
  Plus, 
  HelpCircle, 
  Edit3, 
  Code,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { CourseOutcome, Justification } from "../types";

interface CourseOutcomesMappingProps {
  courseCode: string;
  courseName: string;
  initialCOs: CourseOutcome[];
  initialJustifications: Justification[];
}

export default function CourseOutcomesMapping({
  courseCode,
  courseName,
  initialCOs,
  initialJustifications
}: CourseOutcomesMappingProps) {
  // Local state tracking
  const [cos, setCos] = useState<CourseOutcome[]>(initialCOs);
  const [justifications, setJustifications] = useState<Justification[]>(initialJustifications);
  
  // CO Editor State
  const [editingCoId, setEditingCoId] = useState<string | null>("CO3");
  const [editDesc, setEditDesc] = useState<string>("Evaluate query performance and optimize database transactions using indexing and concurrency control mechanisms.");
  const [editBlooms, setEditBlooms] = useState<string>("L5 - Evaluate");
  
  // State for creating a new CO
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDesc, setNewDesc] = useState("");
  const [newBlooms, setNewBlooms] = useState("L3 - Apply");

  // State for matrix cells (CO1..CO3 vs PO1..PO12)
  const [matrix, setMatrix] = useState<Record<string, Record<string, number>>>({
    CO1: { PO1: 3, PO2: 2, PO3: 3, PO4: 1, PO5: 0, PO6: 2, PO7: 0, PO8: 1, PO9: 2, PO10: 0, PO11: 1, PO12: 3 },
    CO2: { PO1: 2, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 1, PO9: 3, PO10: 2, PO11: 0, PO12: 2 },
    CO3: { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 1, PO6: 2, PO7: 2, PO8: 0, PO9: 1, PO10: 2, PO11: 2, PO12: 3 }
  });

  // AI loading status
  const [aiSuggesting, setAiSuggesting] = useState(false);
  const [aiDraftingPair, setAiDraftingPair] = useState<{coId: string, poId: string} | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Auto calculate Mapping statistics
  const [mappingStats, setMappingStats] = useState({
    healthIndex: 82,
    posAddressed: 9,
    avgStrength: 2.4
  });

  // Calculate Averages dynamically based on matrix state
  const coKeys = Object.keys(matrix);
  const poKeys = ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6", "PO7", "PO8", "PO9", "PO10", "PO11", "PO12"];

  // Calculate row average
  const getCoRowAverage = (coId: string): string => {
    const rowValues = Object.values(matrix[coId] || {}) as number[];
    if (rowValues.length === 0) return "0.00";
    const sum = rowValues.reduce((acc, val) => acc + val, 0);
    return (sum / rowValues.length).toFixed(2);
  };

  // Calculate column average
  const getPoColAverage = (poId: string): string => {
    let sum = 0;
    let count = 0;
    for (const coId of coKeys) {
      if (matrix[coId] && matrix[coId][poId] !== undefined) {
        sum += matrix[coId][poId];
        count++;
      }
    }
    return count > 0 ? (sum / count).toFixed(2) : "0.00";
  };

  // Total Matrix Average
  const getTotalMatrixAverage = (): string => {
    let sum = 0;
    let count = 0;
    for (const coId of coKeys) {
      for (const poId of poKeys) {
        if (matrix[coId] && matrix[coId][poId] !== undefined) {
          sum += matrix[coId][poId];
          count++;
        }
      }
    }
    return count > 0 ? (sum / count).toFixed(2) : "0.00";
  };

  // Re-calculate Stats dynamically when Matrix changes
  useEffect(() => {
    let addressedCount = 0;
    let sum = 0;
    let totalCells = 0;

    for (const poId of poKeys) {
      let isAddressed = false;
      for (const coId of coKeys) {
        const value = matrix[coId]?.[poId] || 0;
        sum += value;
        totalCells++;
        if (value > 0) {
          isAddressed = true;
        }
      }
      if (isAddressed) addressedCount++;
    }

    const avg = totalCells > 0 ? Number((sum / totalCells).toFixed(1)) : 2.0;
    // Health Index bounds
    const health = Math.min(100, Math.round((addressedCount / 12) * 110));

    setMappingStats({
      healthIndex: health,
      posAddressed: addressedCount,
      avgStrength: avg
    });
  }, [matrix]);

  // Handle cell input change
  const handleCellChange = (coId: string, poId: string, val: string) => {
    const numericVal = Math.max(0, Math.min(3, Number(val) || 0));
    setMatrix(prev => ({
      ...prev,
      [coId]: {
        ...prev[coId],
        [poId]: numericVal
      }
    }));
  };

  // Trigger Save CO
  const handleSaveCO = (id: string) => {
    setCos(prev => prev.map(c => c.id === id ? { ...c, description: editDesc, bloomsLevel: editBlooms } : c));
    setEditingCoId(null);
    showToast("Course outcome updated successfully.");
  };

  // Create new CO
  const handleAddNewCO = () => {
    if (!newDesc.trim()) return;
    const nextIndex = cos.length + 1;
    const newCode = `CO${nextIndex}`;
    const newId = `co-${Date.now()}`;
    const newOutcome: CourseOutcome = {
      id: newId,
      code: newCode,
      description: newDesc,
      bloomsLevel: newBlooms
    };

    setCos(prev => [...prev, newOutcome]);
    
    // Add default row values to matrix
    setMatrix(prev => ({
      ...prev,
      [newCode]: { PO1: 2, PO2: 2, PO3: 1, PO4: 0, PO5: 0, PO6: 1, PO7: 0, PO8: 1, PO9: 1, PO10: 0, PO11: 0, PO12: 1 }
    }));

    setNewDesc("");
    setIsAddingNew(false);
    showToast(`New outcome ${newCode} was successfully appended.`);
  };

  // Call Gemini API to suggest a CO
  const handleAISuggest = async () => {
    setAiSuggesting(true);
    try {
      const response = await fetch("/api/ai/suggest-co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseName,
          currentCOs: cos.map(c => `${c.code}: ${c.description}`)
        })
      });
      const data = await response.json();
      if (data.success && data.suggestion) {
        // Adopt suggestion into editing fields or append
        const sug = data.suggestion;
        setNewDesc(sug.description);
        setNewBlooms(sug.bloomsLevel);
        setIsAddingNew(true);
        showToast("AI suggestion drafted. Review in the outcome editor below!");
      }
    } catch (err) {
      console.error(err);
      showToast("Could not contact AI model. Standard backup loaded.");
    } finally {
      setAiSuggesting(false);
    }
  };

  // Call Gemini API to justify mapping pair
  const handleAIJustify = async (coId: string, poId: string, strength: number) => {
    setAiDraftingPair({ coId, poId });
    try {
      const coObj = cos.find(c => c.code === coId);
      const res = await fetch("/api/ai/justify-mapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coCode: coId,
          coDesc: coObj?.description || "",
          poCode: poId,
          poDesc: `Program level assessment for engineering skills`,
          strength
        })
      });
      const data = await res.json();
      if (data.success && data.narrative) {
        // Add or update justification in local table list
        const exists = justifications.some(j => j.coId === coId && j.poId === poId);
        if (exists) {
          setJustifications(prev => prev.map(j => 
            j.coId === coId && j.poId === poId 
              ? { ...j, narrative: data.narrative, strength, isAiDrafted: true } 
              : j
          ));
        } else {
          setJustifications(prev => [
            ...prev,
            {
              id: `just-${Date.now()}`,
              coId,
              poId,
              strength,
              narrative: data.narrative,
              isAiDrafted: true
            }
          ]);
        }
        showToast(`AI successfully compiled narrative for ${coId}-${poId}.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiDraftingPair(null);
    }
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const deleteCO = (id: string, code: string) => {
    setCos(prev => prev.filter(c => c.id !== id));
    // Remove from matrix
    const newMat = { ...matrix };
    delete newMat[code];
    setMatrix(newMat);
    showToast(`${code} deleted successfully.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toast popup */}
      {successToast && (
        <div className="fixed top-18 right-6 z-50 bg-primary-container border-l-4 border-secondary text-primary p-4 rounded shadow-lg flex items-center gap-2 max-w-sm animate-bounce">
          <Sparkles className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-xs font-semibold">{successToast}</p>
        </div>
      )}

      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <nav className="flex items-center gap-2 text-on-surface-variant font-sans tracking-wider text-[11px] font-bold mb-2 uppercase">
            <span>COURSES</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-primary">{courseCode} - {courseName}</span>
          </nav>
          <h2 className="font-display text-3xl font-bold text-primary tracking-tight">Course Outcomes &amp; Mapping</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="bg-status-warning text-white font-sans text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-sm">
              Pending HOD Approval
            </span>
            <span className="text-on-surface-variant text-xs">Last updated: Oct 24, 2026</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => showToast("Draft saved as offline revision successfully.")}
            className="px-4 py-2 border border-primary text-primary rounded-lg font-sans text-xs font-bold hover:bg-primary/5 transition-all duration-150 active:scale-95"
          >
            SAVE DRAFT
          </button>
          <button 
            onClick={() => showToast("Curriculum packet dispatched for HOD reviewing.")}
            className="px-4 py-2 bg-primary text-white rounded-lg font-sans text-xs font-bold shadow-sm hover:opacity-95 transition-all flex items-center gap-2 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" /> SUBMIT FOR APPROVAL
          </button>
        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: CO Definition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Code className="w-5 h-5 text-secondary" /> Course Outcomes (COs)
              </h3>
              <button 
                onClick={() => setIsAddingNew(true)}
                className="text-secondary text-xs font-bold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-4 h-4" /> ADD NEW CO
              </button>
            </div>

            <div className="space-y-4">
              {/* Add New CO Form Container */}
              {isAddingNew && (
                <div className="p-4 border border-secondary border-dashed rounded-lg bg-secondary-container/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-secondary text-white text-[11px] font-bold px-2 py-0.5 rounded">New Draft Outcome</span>
                    <button onClick={() => setIsAddingNew(false)} className="text-xs text-on-surface-variant hover:text-red-600">Cancel</button>
                  </div>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Enter outcomes narrative..."
                    className="w-full bg-white border border-data-entry-border rounded p-3 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none"
                    rows={2}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex-1 max-w-[200px]">
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">BLOOM'S LEVEL</span>
                      <select 
                        value={newBlooms}
                        onChange={(e) => setNewBlooms(e.target.value)}
                        className="w-full bg-white border border-data-entry-border rounded p-2 text-xs"
                      >
                        <option>L1 - Remember</option>
                        <option>L2 - Understand</option>
                        <option>L3 - Apply</option>
                        <option>L4 - Analyze</option>
                        <option>L5 - Evaluate</option>
                        <option>L6 - Create</option>
                      </select>
                    </div>
                    <button 
                      onClick={handleAddNewCO}
                      className="px-4 py-2 bg-secondary text-white font-sans text-xs font-semibold rounded hover:bg-secondary-container transition-all"
                    >
                      COMMIT NEW OUTCOME
                    </button>
                  </div>
                </div>
              )}

              {cos.map((co) => {
                const isEditing = editingCoId === co.id;
                
                if (isEditing) {
                  return (
                    <div key={co.id} className="p-4 border-2 border-secondary bg-secondary-container/10 rounded-lg space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="bg-secondary text-white text-[11px] font-bold px-2 py-0.5 rounded">
                          {co.code} (Editing)
                        </span>
                      </div>
                      <textarea 
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full bg-white border border-data-entry-border rounded p-3 text-xs focus:ring-1 focus:ring-secondary focus:border-secondary transition-all outline-none" 
                        rows={2}
                      />
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <label className="text-[9px] font-sans uppercase font-bold text-on-surface-variant block mb-1">BLOOM'S TAXONOMY</label>
                          <select 
                            value={editBlooms} 
                            onChange={(e) => setEditBlooms(e.target.value)}
                            className="w-full bg-white border border-data-entry-border rounded p-2 text-xs"
                          >
                            <option>L1 - Remember</option>
                            <option>L2 - Understand</option>
                            <option>L3 - Apply</option>
                            <option>L4 - Analyze</option>
                            <option>L5 - Evaluate</option>
                            <option>L6 - Create</option>
                          </select>
                        </div>
                        <div className="flex items-end gap-2 pt-5 ml-auto">
                          <button 
                            onClick={() => setEditingCoId(null)}
                            className="px-3 py-2 text-secondary text-xs font-bold hover:bg-secondary/5 rounded transition-all"
                          >
                            CANCEL
                          </button>
                          <button 
                            onClick={() => handleSaveCO(co.id)}
                            className="px-4 py-2 bg-secondary text-white text-xs font-bold rounded shadow-sm hover:opacity-90 transition-all"
                          >
                            SAVE CO
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={co.id} 
                    className="group p-4 border border-data-entry-border rounded-lg bg-surface hover:border-secondary transition-all relative duration-150 hover:shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded">
                        {co.code}
                      </span>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button 
                          onClick={() => {
                            setEditingCoId(co.id);
                            setEditDesc(co.description);
                            setEditBlooms(co.bloomsLevel);
                          }}
                          className="p-1 hover:bg-surface-container rounded text-on-surface-variant hover:text-primary transition-colors"
                          title="Edit outcome"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => deleteCO(co.id, co.code)}
                          className="p-1 hover:bg-surface-container rounded text-status-gap hover:text-red-700 transition-colors"
                          title="Delete outcome"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-on-surface leading-normal mb-3">{co.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-sans font-bold text-on-surface-variant">BLOOM'S LEVEL:</span>
                      <span className="bg-surface-container-high text-on-surface font-sans text-[11px] font-bold px-2 py-1 rounded border border-outline-variant/50">
                        {co.bloomsLevel}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* AI Suggestion Box */}
              <div className="p-4 bg-primary-container/10 border-l-4 border-primary rounded-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-primary font-bold">AI Suggestion</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Based on your outline syllabus, you might want to add a CO for <strong>"Designing NoSQL solutions for unstructured big data"</strong> at Bloom's Level L6.
                  </p>
                  <button 
                    disabled={aiSuggesting}
                    onClick={handleAISuggest}
                    className="mt-2 text-primary text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 hover:underline disabled:opacity-50"
                  >
                    {aiSuggesting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> COMPILED BY AI...
                      </>
                    ) : (
                      "ADOPT SUGGESTION"
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Stats & Justify */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mapping Health Card */}
          <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <h3 className="font-sans font-semibold tracking-wider text-[11px] text-on-surface-variant uppercase mb-4">
              MAPPING HEALTH INDEX
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display font-bold text-3xl text-primary">{mappingStats.healthIndex}%</p>
                <p className="text-xs text-status-attained font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Good Coverage
                </p>
              </div>
              <div className="h-14 w-28">
                {/* SVG Sparkline */}
                <svg className="w-full h-full stroke-secondary fill-none stroke-3" viewBox="0 0 100 40">
                  <path d="M0,35 Q12,12 24,28 T48,16 T72,24 T90,5 T100,20" />
                </svg>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-data-entry-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-sans font-bold text-on-surface-variant uppercase">POs ADDRESSED</p>
                <p className="font-display font-bold text-lg text-primary mt-1">{mappingStats.posAddressed}/12</p>
              </div>
              <div>
                <p className="text-[10px] font-sans font-bold text-on-surface-variant uppercase">AVG STRENGTH</p>
                <p className="font-display font-bold text-lg text-primary mt-1">{mappingStats.avgStrength}</p>
              </div>
            </div>
          </div>

          {/* Justification Intro Sidepanel */}
          <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-6 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-secondary" />
              <h3 className="font-display text-lg font-bold text-primary">Justification Logic</h3>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
              OBE Mapping strength (1-3) coordinates must be strictly justified by syllabus structures and evaluation logs to clear HOD checks.
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-surface border border-data-entry-border rounded text-xs leading-normal italic border-l-4 border-status-warning">
                "Strength of 3 for CO2-PO3 is justified by the semester-long mini-project requiring full SQL physical layout."
              </div>
              <div className="p-3 bg-surface border border-data-entry-border rounded text-xs leading-normal italic border-l-4 border-primary">
                "CO1-PO1 (Strength 2) is addressed through 4 hours of lectures and 2 tutorial sheets on ER modelling metrics."
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Grid Column: CO-PO Matrix */}
        <div className="lg:col-span-12">
          <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-data-entry-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-secondary" /> CO-PO Mapping Matrix
              </h3>
              
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-white border border-data-entry-border rounded"></span> 0: No Correlation
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-secondary/15 rounded"></span> 1: Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-secondary/40 rounded"></span> 2: Medium
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-secondary text-white border-0 flex items-center justify-center text-[8px] rounded">✔</span> 3: High
                </span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse font-sans">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="p-3 border-b border-data-entry-border font-bold text-primary w-24 text-xs font-sans">
                      CO \ PO
                    </th>
                    {poKeys.map(po => (
                      <th key={po} className="p-3 border-b border-data-entry-border text-center text-xs font-sans group relative cursor-help">
                        {po}
                        <div className="absolute hidden group-hover:block bg-inverse-surface text-white p-2 rounded text-[10px] -top-12 left-1/2 -translate-x-1/2 w-48 z-40 shadow-lg leading-normal">
                          Program outcome criteria evaluation support for {po}. Values bounded strictly 0 - 3.
                        </div>
                      </th>
                    ))}
                    <th className="p-3 border-b border-data-entry-border font-bold text-center text-xs font-sans uppercase">AVG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-data-entry-border">
                  {cos.map((co) => (
                    <tr key={co.id} className="hover:bg-surface/50 transition-colors">
                      <td className="p-3 font-bold text-primary bg-surface-container-low border-r border-data-entry-border text-xs">
                        {co.code}
                      </td>
                      {poKeys.map(po => {
                        const cellVal = matrix[co.code]?.[po] ?? 0;
                        let cellBg = "bg-transparent";
                        let fontColor = "text-on-surface";
                        let fontWt = "font-medium";
                        
                        if (cellVal === 3) {
                          cellBg = "bg-secondary/15";
                          fontColor = "text-secondary";
                          fontWt = "font-bold";
                        } else if (cellVal === 2) {
                          cellBg = "bg-secondary/10";
                        } else if (cellVal === 1) {
                          cellBg = "bg-secondary/5";
                        } else {
                          fontColor = "text-on-surface-variant/40";
                        }

                        return (
                          <td key={po} className={`p-0 border-r border-data-entry-border ${cellBg}`}>
                            <input 
                              type="number" 
                              min={0}
                              max={3}
                              value={cellVal}
                              onChange={(e) => handleCellChange(co.code, po, e.target.value)}
                              className={`w-full h-full p-3 text-center border-0 mapping-input outline-none focus:ring-1 focus:ring-secondary transition-all text-xs ${fontColor} ${fontWt}`}
                            />
                          </td>
                        );
                      })}
                      <td className="p-3 text-center font-bold text-xs bg-surface-container-low text-primary">
                        {getCoRowAverage(co.code)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-container font-bold text-xs">
                    <td className="p-3 text-primary uppercase">PO AVG</td>
                    {poKeys.map((po) => (
                      <td key={po} className="p-3 text-center text-primary">
                        {getPoColAverage(po)}
                      </td>
                    ))}
                    <td className="p-3 text-center bg-primary text-white text-xs font-extrabold">
                      {getTotalMatrixAverage()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Justification Register Table */}
        <div className="lg:col-span-12">
          <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-data-entry-border flex justify-between items-center">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-secondary" /> Justification Register
              </h3>
              <p className="text-[10px] font-sans font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-1 rounded">
                Strict Audit Trace Log
              </p>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="p-3 border-b border-data-entry-border w-24">CO ID</th>
                    <th className="p-3 border-b border-data-entry-border w-24">PO ID</th>
                    <th className="p-3 border-b border-data-entry-border w-32">STRENGTH</th>
                    <th className="p-3 border-b border-data-entry-border">JUSTIFICATION NARRATIVE</th>
                    <th className="p-3 border-b border-data-entry-border w-28 text-center bg-surface-container-high font-bold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-data-entry-border zebra-table">
                  {justifications.map((just) => (
                    <tr key={just.id} className="hover:bg-surface/30">
                      <td className="p-3 font-bold text-primary">{just.coId}</td>
                      <td className="p-3 font-semibold text-on-surface-variant">{just.poId}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          just.strength === 3 
                            ? "bg-secondary text-white" 
                            : just.strength === 2 
                            ? "bg-secondary-container text-on-secondary-container" 
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}>
                          {just.strength === 3 ? "High (3)" : just.strength === 2 ? "Medium (2)" : "Low (1)"}
                        </span>
                      </td>
                      <td className="p-3 text-on-surface leading-normal">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="italic">"{just.narrative}"</span>
                          {just.isAiDrafted && (
                            <span className="bg-primary-fixed text-on-primary-fixed-variant px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider uppercase shrink-0">
                              AI DRAFTED
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button 
                          disabled={aiDraftingPair?.coId === just.coId && aiDraftingPair?.poId === just.poId}
                          onClick={() => handleAIJustify(just.coId, just.poId, just.strength)}
                          className="px-2.5 py-1 text-[10px] text-secondary font-bold hover:underline inline-flex items-center gap-1 active:scale-95 disabled:opacity-50 border border-secondary/20 rounded hover:bg-secondary/5 transition-all"
                        >
                          {aiDraftingPair?.coId === just.coId && aiDraftingPair?.poId === just.poId ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin text-secondary" /> AI DRAFTING...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 text-secondary" /> Draft via AI
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Matrix Mapping Help Prompt Row */}
                  <tr className="bg-secondary-container/5">
                    <td colSpan={5} className="p-4 text-center">
                      <span className="text-on-surface-variant/80 text-xs">
                        💡 Set new values (1-3) inside the matric matrix tables above to enable corresponding Register Narrative edits.
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
