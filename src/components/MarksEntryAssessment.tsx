import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  CloudLightning, 
  Upload, 
  Download, 
  Filter, 
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send,
  FileSpreadsheet,
  FileMinus,
  Sparkles,
  BarChart2
} from "lucide-react";
import { StudentMarkRow } from "../types";

interface MarksEntryAssessmentProps {
  onBack: () => void;
  initialStudents: StudentMarkRow[];
}

export default function MarksEntryAssessment({ onBack, initialStudents }: MarksEntryAssessmentProps) {
  const [students, setStudents] = useState<StudentMarkRow[]>(initialStudents);
  const [successToast, setSuccessToast] = useState<string | null>("Verification successful: 42 rows validated for upload.");
  const [searchFilter, setSearchFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    avgPercent: 74,
    classAverage: 37.2,
    coLevels: { CO1: 80, CO2: 65, CO3: 40 }
  });

  // Calculate student total score
  const calculateRowTotal = (row: StudentMarkRow): number => {
    const q1a = Number(row.q1a) || 0;
    const q1b = Number(row.q1b) || 0;
    const q2 = Number(row.q2) || 0;
    const q3 = Number(row.q3) || 0;
    return q1a + q1b + q2 + q3;
  };

  // Re-run summary calculations on change
  useEffect(() => {
    let grandSum = 0;
    let studentsCount = 0;

    let co1Sum = 0;
    let co1MaxSum = 0;
    let co2Sum = 0;
    let co2MaxSum = 0;
    let co3Sum = 0;
    let co3MaxSum = 0;

    students.forEach(s => {
      const q1aNum = Number(s.q1a) || 0;
      const q1bNum = Number(s.q1b) || 0;
      const q2Num = Number(s.q2) || 0;
      const q3Num = Number(s.q3) || 0;

      const sum = q1aNum + q1bNum + q2Num + q3Num;
      grandSum += sum;
      studentsCount++;

      // Max values: Q1a=5, Q1b=5, Q2=10, Q3=10
      // Check limits before incorporating to averages
      if (q1aNum <= 5 && q1bNum <= 5) {
        co1Sum += q1aNum + q1bNum;
        co1MaxSum += 10;
      }
      if (q2Num <= 10) {
        co2Sum += q2Num;
        co2MaxSum += 10;
      }
      if (q3Num <= 10) {
        co3Sum += q3Num;
        co3MaxSum += 10;
      }
    });

    const valAverage = studentsCount > 0 ? (grandSum / studentsCount) : 0;
    // Bounded average score out of max total marks (50)
    // For our simulated exam of Q1a(5)+Q1b(5)+Q2(10)+Q3(10) = max 30
    const classAvg = Number(valAverage.toFixed(1));
    const averagePercent = Math.min(100, Math.round((classAvg / 30) * 100));

    // CO Levels
    const co1Percent = co1MaxSum > 0 ? Math.round((co1Sum / co1MaxSum) * 100) : 80;
    const co2Percent = co2MaxSum > 0 ? Math.round((co2Sum / co2MaxSum) * 100) : 65;
    const co3Percent = co3MaxSum > 0 ? Math.round((co3Sum / co3MaxSum) * 100) : 40;

    setStats({
      avgPercent: averagePercent,
      classAverage: Number((classAvg * 1.24).toFixed(1)), // Scale up for final representation of 50 total marks
      coLevels: {
        CO1: co1Percent,
        CO2: co2Percent,
        CO3: co3Percent
      }
    });
  }, [students]);

  // Handle cell text adjustments
  const handleMarkChange = (studentId: string, field: 'q1a' | 'q1b' | 'q2' | 'q3', value: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updated = {
          ...s,
          [field]: value
        };
        return {
          ...updated,
          total: calculateRowTotal(updated)
        };
      }
      return s;
    }));
  };

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  const handleBulkUploadMock = () => {
    // Generate some extra rows slightly
    showToast("Bulk spreadsheet parse complete: 42 records synced instantly.");
  };

  // Filter students based on name or USN search query
  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.usn.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-white/50 border border-data-entry-border px-4 py-2.5 rounded-lg">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-primary text-xs font-bold hover:text-secondary group transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Dashboard
        </button>
        <div className="flex items-center gap-2 text-status-attained font-sans font-bold text-xs bg-status-attained/5 rounded-full px-2.5 py-1 select-none">
          <CheckCircle className="w-3.5 h-3.5 text-status-attained" />
          <span>Autosaved</span>
        </div>
      </div>

      {/* Assessment Metadata Card */}
      <section className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-sans font-bold text-[10px] tracking-widest text-on-surface-variant uppercase block">
              COURSE ID: CS402
            </span>
            <h2 className="font-display text-2xl font-bold text-primary mt-1">Theory of Computation</h2>
          </div>
          <span className="bg-primary-container text-on-primary-container font-sans text-xs font-bold px-3.5 py-1 rounded-full shadow-sm select-none">
            CIE-1
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-data-entry-border/50">
          <div className="border-l-3 border-primary pl-4">
            <span className="font-sans font-bold uppercase text-[10px] tracking-wide text-on-surface-variant block">TOTAL MARKS</span>
            <span className="font-display font-black text-3xl text-primary mt-1 block">50</span>
          </div>
          <div className="border-l-3 border-secondary pl-4">
            <span className="font-sans font-bold uppercase text-[10px] tracking-wide text-on-surface-variant block">STUDENTS ENROLLED</span>
            <span className="font-display font-black text-3xl text-primary mt-1 block">42/45</span>
          </div>
        </div>
      </section>

      {/* Action Bar: CSV Upload & Filters */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 no-scrollbar lg:justify-between">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handleBulkUploadMock}
              className="flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-lg font-sans text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all text-center whitespace-nowrap"
            >
              <Upload className="w-3.5 h-3.5" /> BULK UPLOAD (CSV)
            </button>
            <button 
              onClick={() => showToast("CIE evaluation spreadsheet template successfully exported.")}
              className="flex items-center gap-1 border border-primary text-primary bg-transparent px-4 py-2 rounded-lg font-sans text-xs font-bold hover:bg-primary/5 active:scale-95 transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" /> GET TEMPLATE
            </button>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text"
                placeholder="Search USN or student name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white border border-data-entry-border p-2 pl-3 text-xs rounded-lg outline-none focus:border-secondary transition-all"
              />
            </div>
            <button className="flex items-center gap-1 border border-outline text-on-surface px-4 py-2 rounded-lg font-sans text-xs font-bold hover:bg-surface-container transition-all">
              <Filter className="w-3.5 h-3.5" /> FILTER
            </button>
          </div>
        </div>

        {/* Validation Toast Header (Contextual banner matching screenshot) */}
        {successToast && (
          <div className="bg-status-attained/10 border border-status-attained p-3.5 rounded-lg flex items-center justify-between shadow-sm animate-pulse-slow">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-status-attained shrink-0" />
              <p className="text-xs font-bold text-on-surface tracking-wide">{successToast}</p>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-[11px] font-bold text-on-surface-variant hover:text-on-surface">Dismiss</button>
          </div>
        )}
      </section>

      {/* Marks Entry Grid */}
      <section className="bg-surface-container-lowest border border-data-entry-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse font-sans">
            <thead className="bg-surface-container border-b border-data-entry-border">
              <tr className="text-left">
                <th className="pinned-column p-3.5 font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase min-w-[140px] bg-surface-container">
                  Student Name
                </th>
                <th className="p-3 text-center min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="font-sans font-extrabold text-xs text-primary">Q1a</span>
                    <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold mt-1">CO1</span>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1.5 font-bold">[5]</span>
                  </div>
                </th>
                <th className="p-3 text-center min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="font-sans font-extrabold text-xs text-primary">Q1b</span>
                    <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold mt-1">CO1</span>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1.5 font-bold">[5]</span>
                  </div>
                </th>
                <th className="p-3 text-center min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="font-sans font-extrabold text-xs text-primary">Q2</span>
                    <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold mt-1">CO2</span>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1.5 font-bold">[10]</span>
                  </div>
                </th>
                <th className="p-3 text-center min-w-[80px]">
                  <div className="flex flex-col items-center">
                    <span className="font-sans font-extrabold text-xs text-primary">Q3</span>
                    <span className="text-[9px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold mt-1">CO3</span>
                    <span className="text-[10px] text-on-surface-variant/70 mt-1.5 font-bold">[10]</span>
                  </div>
                </th>
                <th className="p-3 text-center min-w-[90px] border-l border-data-entry-border">
                  <span className="font-sans font-extrabold text-xs text-primary block">TOTAL</span>
                  <span className="text-[10px] text-on-surface-variant font-bold mt-2 block">[30]</span>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-data-entry-border text-xs">
              {filteredStudents.map((row) => {
                const q1aExceeds = (Number(row.q1a) || 0) > 5;
                const q1bExceeds = (Number(row.q1b) || 0) > 5;
                const q2Exceeds = (Number(row.q2) || 0) > 10;
                const q3Exceeds = (Number(row.q3) || 0) > 10;
                const anyError = q1aExceeds || q1bExceeds || q2Exceeds || q3Exceeds;

                return (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-surface-container-low transition-colors ${
                      anyError ? 'bg-error-container/10' : 'bg-white'
                    }`}
                  >
                    <td className={`pinned-column p-4 font-semibold text-on-surface ${
                      anyError ? 'bg-error-container/20' : 'bg-white'
                    }`}>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{row.studentName}</span>
                        <span className="text-[10px] text-on-surface-variant mt-0.5">USN: {row.usn}</span>
                      </div>
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        value={row.q1a}
                        onChange={(e) => handleMarkChange(row.id, 'q1a', e.target.value)}
                        className={`w-full max-w-[64px] text-center border p-1 rounded font-medium focus:ring-1 outline-none text-xs ${
                          q1aExceeds ? 'border-status-gap bg-error-container text-on-error-container focus:ring-status-gap' : 'border-data-entry-border focus:border-secondary focus:ring-secondary'
                        }`}
                      />
                      {q1aExceeds && <span className="text-[9px] text-status-gap font-extrabold block mt-1">Exceeds Max</span>}
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        value={row.q1b}
                        onChange={(e) => handleMarkChange(row.id, 'q1b', e.target.value)}
                        className={`w-full max-w-[64px] text-center border p-1 rounded font-medium focus:ring-1 outline-none text-xs ${
                          q1bExceeds ? 'border-status-gap bg-error-container text-on-error-container focus:ring-status-gap' : 'border-data-entry-border focus:border-secondary focus:ring-secondary'
                        }`}
                      />
                      {q1bExceeds && <span className="text-[9px] text-status-gap font-extrabold block mt-1">Exceeds Max</span>}
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="number" 
                        value={row.q2}
                        onChange={(e) => handleMarkChange(row.id, 'q2', e.target.value)}
                        className={`w-full max-w-[64px] text-center border p-1 rounded font-medium focus:ring-1 outline-none text-xs ${
                          q2Exceeds ? 'border-status-gap bg-error-container text-on-error-container focus:ring-status-gap' : 'border-data-entry-border focus:border-secondary focus:ring-secondary'
                        }`}
                      />
                      {q2Exceeds && <span className="text-[9px] text-status-gap font-extrabold block mt-1">Exceeds Max</span>}
                    </td>

                    <td className="p-3 text-center">
                      <input 
                        type="text" 
                        value={row.q3}
                        onChange={(e) => handleMarkChange(row.id, 'q3', e.target.value)}
                        placeholder="AB"
                        className={`w-full max-w-[64px] text-center border p-1 rounded font-medium focus:ring-1 outline-none text-xs ${
                          q3Exceeds ? 'border-status-gap bg-error-container text-on-error-container focus:ring-status-gap' : 'border-data-entry-border focus:border-secondary focus:ring-secondary'
                        }`}
                      />
                      {q3Exceeds && <span className="text-[9px] text-status-gap font-extrabold block mt-1">Exceeds Max</span>}
                    </td>

                    <td className="p-4 text-center font-bold text-primary text-sm border-l border-data-entry-border">
                      {row.total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar of Grid */}
        <div className="p-3.5 bg-surface-container flex justify-between items-center border-t border-data-entry-border">
          <span className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase">
            Displaying 1-{filteredStudents.length} of 42
          </span>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors duration-150">
              <ChevronLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button className="p-1 hover:bg-surface-container-highest rounded-lg transition-colors duration-150">
              <ChevronRight className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
        </div>
      </section>

      {/* Insights & Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CO Trend Card */}
        <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-5 flex flex-col justify-between">
          <h3 className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase mb-4">
            CO Performance Trend
          </h3>
          <div className="flex items-end gap-3 h-24 px-4">
            <div className="flex flex-col items-center flex-1">
              <div 
                className="bg-primary w-full rounded-t transition-all duration-300"
                style={{ height: `${stats.coLevels.CO1 || 80}%` }}
                title={`CO1 attainment: ${stats.coLevels.CO1 || 80}%`}
              ></div>
              <span className="text-[10px] font-bold text-on-surface-variant mt-2 block">CO1</span>
            </div>
            
            <div className="flex flex-col items-center flex-1">
              <div 
                className="bg-primary w-full rounded-t transition-all duration-300"
                style={{ height: `${stats.coLevels.CO2 || 65}%` }}
                title={`CO2 attainment: ${stats.coLevels.CO2 || 65}%`}
              ></div>
              <span className="text-[10px] font-bold text-on-surface-variant mt-2 block">CO2</span>
            </div>

            <div className="flex flex-col items-center flex-1">
              <div 
                className="bg-primary w-full rounded-t transition-all duration-300"
                style={{ height: `${stats.coLevels.CO3 || 40}%` }}
                title={`CO3 attainment: ${stats.coLevels.CO3 || 40}%`}
              ></div>
              <span className="text-[10px] font-bold text-on-surface-variant mt-2 block">CO3</span>
            </div>
          </div>
        </div>

        {/* Assessment Average Card */}
        <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-5 h-full flex flex-col justify-between">
          <h3 className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase mb-2">
            Average Attainment
          </h3>
          <div className="flex items-center gap-5 my-auto">
            <span className="font-display font-black text-4xl text-status-attained">
              {stats.avgPercent}%
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-status-attained bg-status-attained/10 px-2.5 py-0.5 rounded-full tracking-wider uppercase block">
                +12% from CIE-0
              </span>
              <span className="text-xs text-on-surface-variant mt-1.5 font-sans font-medium">
                Class Average: {stats.classAverage}/50
              </span>
            </div>
          </div>
        </div>

        {/* Bulk action hub */}
        <div className="bg-surface-container-lowest border border-data-entry-border rounded-xl p-5 shadow-sm">
          <h3 className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase mb-4">
            Bulk Action Hub
          </h3>
          <div className="space-y-2.5">
            <button 
              onClick={() => showToast("Curriculum packet dispatched to Dean checkboards.")}
              className="w-full text-left py-2 px-3 bg-surface border border-data-entry-border rounded-lg flex items-center justify-between text-on-surface hover:bg-secondary/5 group transition-colors duration-150 active:scale-[0.99]"
            >
              <span className="text-xs font-bold font-sans">Finalize & Submit to Dean</span>
              <Send className="w-4 h-4 text-on-surface-variant group-hover:text-secondary group-hover:translate-x-0.5 transition-all" />
            </button>
            <button 
              onClick={() => showToast("Discrepancy validation draft downloaded (PDF).")}
              className="w-full text-left py-2 px-3 bg-surface border border-data-entry-border rounded-lg flex items-center justify-between text-on-surface hover:bg-secondary/5 group transition-colors duration-150 active:scale-[0.99]"
            >
              <span className="text-xs font-bold font-sans">Generate Failure Report</span>
              <FileMinus className="w-4 h-4 text-on-surface-variant group-hover:text-status-gap transition-colors" />
            </button>
          </div>
        </div>

      </section>
    </motion.div>
  );
}
