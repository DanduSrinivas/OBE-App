import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  Layers, 
  HelpCircle, 
  AlertTriangle, 
  Activity, 
  Sparkles, 
  FileCheck,
  FolderArchive,
  ArrowRight,
  Filter,
  SortAsc,
  UserCheck,
  Loader2
} from "lucide-react";
import { PendingReviewItem } from "../types";

export default function DepartmentApprovalQueue() {
  const [reviews, setReviews] = useState<PendingReviewItem[]>([
    {
      id: "rev-1",
      type: "CO MAPPING",
      courseCode: "CS402",
      courseName: "Design & Analysis of Algorithms",
      facultyName: "Dr. Sarah Jenkins",
      timeSubmitted: "SUBMITTED 2H AGO",
      details: ["6 COs mapped", "Bloom's L3/L4 Heavy"],
      status: "PENDING"
    },
    {
      id: "rev-2",
      type: "COURSE FILE",
      courseCode: "CS301",
      courseName: "Database Management Systems",
      facultyName: "Prof. Rajesh Kumar",
      timeSubmitted: "SUBMITTED 5H AGO",
      details: ["12 Artifacts Uploaded", "Internal Audit Pass"],
      status: "PENDING"
    },
    {
      id: "rev-3",
      type: "CO MAPPING",
      courseCode: "CS504",
      courseName: "Machine Learning Fundamentals",
      facultyName: "Dr. Elena Rodriguez",
      timeSubmitted: "SUBMITTED 1D AGO",
      details: ["Missing PO3 Mapping"],
      status: "PENDING"
    }
  ]);

  const [countPending, setCountPending] = useState(14);
  const [loadingMore, setLoadingMore] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4500);
  };

  // Approve action
  const handleApprove = (id: string, courseCode: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    setCountPending(c => Math.max(0, c - 1));
    showToast(`Dispatched formal HOD approval for ${courseCode} curriculum record.`);
  };

  // Review / Request edit action
  const handleRequestReview = (id: string, courseCode: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "REVIEW" } : r));
    showToast(`Dispatched feedback request back to the course instructor of ${courseCode}.`);
  };

  // Load more reviews mock simulation
  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const extra: PendingReviewItem[] = [
        {
          id: `rev-extra-1`,
          type: "CO MAPPING",
          courseCode: "CS201",
          courseName: "Computer Networks",
          facultyName: "Dr. Aris Thorne",
          timeSubmitted: "SUBMITTED 2D AGO",
          details: ["4 COs mapped", "Strong PO1 Alignment"],
          status: "PENDING"
        },
        {
          id: `rev-extra-2`,
          type: "COURSE FILE",
          courseCode: "CS502",
          courseName: "Artificial Intelligence & Ethics",
          facultyName: "Prof. Rajesh Kumar",
          timeSubmitted: "SUBMITTED 3D AGO",
          details: ["10 Artifacts Uploaded", "Draft Syllabus Mapped"],
          status: "PENDING"
        }
      ];
      setReviews(prev => [...prev, ...extra]);
      setLoadingMore(false);
      showToast("Appended extra pending evaluation records.");
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toast popup */}
      {successToast && (
        <div className="fixed top-18 right-6 z-50 bg-primary-container border-l-4 border-status-attained text-primary p-4 rounded-xl shadow-lg flex items-center gap-2 max-w-sm">
          <Sparkles className="w-5 h-5 text-secondary shrink-0" />
          <p className="text-xs font-bold leading-normal">{successToast}</p>
        </div>
      )}

      {/* Header section with pending/attainment indicators */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary tracking-tight">Department Approval Queue</h1>
          <p className="text-on-surface-variant text-sm mt-1">Reviewing pending CO mappings and course file submissions for CSE Department.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="bg-surface-container px-4 py-2 rounded border border-outline-variant/60 flex flex-col items-center select-none shadow-sm">
            <span className="font-sans font-bold text-[9px] tracking-wider text-on-surface-variant uppercase">PENDING ITEMS</span>
            <span className="font-display font-black text-xl text-status-warning mt-1">{countPending}</span>
          </div>
          <div className="bg-surface-container px-4 py-2 rounded border border-outline-variant/60 flex flex-col items-center select-none shadow-sm">
            <span className="font-sans font-bold text-[9px] tracking-wider text-on-surface-variant uppercase">AVERAGE ATTAINMENT</span>
            <span className="font-display font-black text-xl text-status-attained mt-1">82%</span>
          </div>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Heatmap & AI Insights Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Heatmap Preview Card */}
          <section className="bg-surface-container-lowest border border-data-entry-border p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-data-entry-border/50">
              <h2 className="font-sans font-bold text-[10px] tracking-wider text-on-surface-variant uppercase flex items-center gap-1">
                <Activity className="w-4 h-4 text-primary" /> ATTAINMENT HEATMAP (CO vs PO)
              </h2>
              <HelpCircle className="w-4 h-4 text-on-surface-variant/40 cursor-help" />
            </div>

            {/* Simulated Heatmap Matrix Grid representing CSE Aggregate */}
            <div className="grid grid-cols-6 gap-1 custom-scrollbar overflow-x-auto pb-2 select-none text-center">
              {/* Header */}
              <div className="h-6"></div>
              <div className="font-sans font-bold text-[8px] text-on-surface-variant">PO1</div>
              <div className="font-sans font-bold text-[8px] text-on-surface-variant">PO2</div>
              <div className="font-sans font-bold text-[8px] text-on-surface-variant">PO3</div>
              <div className="font-sans font-bold text-[8px] text-on-surface-variant">PO4</div>
              <div className="font-sans font-bold text-[8px] text-on-surface-variant">PO5</div>

              {/* CO1 Row */}
              <div className="font-sans font-bold text-[9px] flex items-center justify-start text-primary">CO1</div>
              <div className="h-8 rounded-sm bg-status-attained opacity-90 border border-white hover:scale-105 transition-all duration-150 cursor-pointer" title="CO1-PO1: High"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-70 border border-white hover:scale-105 transition-all duration-150 cursor-pointer" title="CO1-PO2: Medium"></div>
              <div className="h-8 rounded-sm bg-status-warning opacity-40 border border-white hover:scale-105 transition-all duration-150 cursor-pointer" title="CO1-PO3: Low"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-100 border border-white hover:scale-105 transition-all duration-150 cursor-pointer" title="CO1-PO4: Excellent"></div>
              <div className="h-8 rounded-sm bg-surface-container-high border border-white cursor-not-allowed"></div>

              {/* CO2 Row */}
              <div className="font-sans font-bold text-[9px] flex items-center justify-start text-primary">CO2</div>
              <div className="h-8 rounded-sm bg-status-attained opacity-60 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-100 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-80 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-warning opacity-60 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-40 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>

              {/* CO3 Row */}
              <div className="font-sans font-bold text-[9px] flex items-center justify-start text-primary">CO3</div>
              <div className="h-8 rounded-sm bg-status-attained opacity-100 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-gap opacity-80 border border-white hover:scale-105 transition-all duration-150 cursor-pointer animate-pulse-slow" title="Critical action recommended!"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-50 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-attained opacity-90 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
              <div className="h-8 rounded-sm bg-status-warning opacity-30 border border-white hover:scale-105 transition-all duration-150 cursor-pointer"></div>
            </div>

            <div className="mt-4 pt-4 border-t border-data-entry-border flex items-center justify-between text-[10px] font-semibold text-on-surface-variant">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-status-attained rounded-sm"></span> High</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-status-warning rounded-sm"></span> Med</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-status-gap rounded-sm"></span> Crit</span>
              </div>
              <button 
                onClick={() => showToast("Full Heatmap visual diagnostic report compiled.")}
                className="text-secondary font-bold font-sans hover:underline"
              >
                VIEW FULL REPORT
              </button>
            </div>
          </section>

          {/* AI Insights Card */}
          <section className="bg-primary text-on-primary bg-primary-container p-6 rounded-xl relative overflow-hidden flex flex-col justify-between h-48 select-none">
            <div className="absolute -right-4 -bottom-6 opacity-[0.08] pointer-events-none text-white">
              <Layers size={140} />
            </div>
            <div className="relative z-10">
              <span className="font-sans font-bold tracking-widest text-[9px] text-on-primary-container uppercase">
                AI INSIGHT
              </span>
              <h3 className="font-display font-black text-lg text-white mt-1">Mapping Congruence</h3>
              <p className="text-xs text-white/95 mt-2 leading-relaxed">
                92% of new CSE course assessments align with institutional Bloom's Taxonomy bounds dynamically. 2 exceptions require manual override justifications.
              </p>
            </div>
          </section>

        </div>

        {/* Pending Reviews Queue list */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-primary">Pending Reviews</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant font-sans text-[10px] font-bold tracking-wider uppercase rounded-full border border-outline-variant hover:bg-surface-variant cursor-pointer">
                <Filter className="w-3.5 h-3.5" /> FILTER
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1 bg-surface-container text-on-surface-variant font-sans text-[10px] font-bold tracking-wider uppercase rounded-full border border-outline-variant hover:bg-surface-variant cursor-pointer">
                <SortAsc className="w-3.5 h-3.5" /> SORT
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {reviews.map((r) => (
                <motion.div 
                  key={r.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-surface-container-lowest border border-data-entry-border p-5 rounded-xl hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded bg-surface border border-outline-variant/30 flex items-center justify-center text-primary shadow-sm">
                    {r.type === "CO MAPPING" ? (
                      <Layers className="w-6 h-6 text-primary" />
                    ) : (
                      <FolderArchive className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`font-sans tracking-wide text-[9px] font-bold px-2 py-0.5 rounded ${
                        r.type === 'CO MAPPING' 
                          ? 'bg-secondary-fixed text-on-secondary-fixed' 
                          : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        {r.type}
                      </span>
                      <span className="font-sans text-[9px] text-on-surface-variant/80 font-bold tracking-wider uppercase">{r.timeSubmitted}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-primary leading-tight mt-1.5">
                      {r.courseCode}: {r.courseName}
                    </h3>
                    <p className="text-xs text-on-surface-variant mt-1 font-sans">
                      Faculty: <span className="font-semibold text-on-surface">{r.facultyName}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-3 pt-2.5 border-t border-data-entry-border/50">
                      {r.details.map((detail, idx) => {
                        const isErrorDetail = detail.toLowerCase().includes("missing");
                        const isWarningDetail = detail.toLowerCase().includes("heavy");
                        return (
                          <div key={idx} className="flex items-center gap-1.5">
                            {isErrorDetail ? (
                              <AlertTriangle className="w-4 h-4 text-status-gap" />
                            ) : isWarningDetail ? (
                              <AlertTriangle className="w-4 h-4 text-status-warning" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-status-attained" />
                            )}
                            <span className={`text-[11px] font-medium ${
                              isErrorDetail ? 'text-status-gap font-bold' : 'text-on-surface-variant'
                            }`}>{detail}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0 w-full md:w-32">
                    {r.status === "REVIEW" ? (
                      <span className="bg-primary/5 text-primary text-center font-bold px-3 py-2 rounded text-[11px] border border-primary/20">
                        Awaiting Revision
                      </span>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleApprove(r.id, r.courseCode)}
                          className="flex-1 md:flex-none uppercase tracking-wider text-[11px] font-bold px-5 py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg transition-colors active:scale-95 duration-100 shadow-sm"
                        >
                          APPROVE
                        </button>
                        <button 
                          onClick={() => handleRequestReview(r.id, r.courseCode)}
                          className="flex-1 md:flex-none uppercase tracking-wider text-[11px] font-bold px-5 py-2.5 border border-primary hover:bg-surface-container text-primary rounded-lg transition-colors active:scale-95 duration-100"
                        >
                          REVIEW
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state when all approved */}
            {reviews.length === 0 && (
              <div className="text-center p-8 bg-surface-container-lowest border border-data-entry-border border-dashed rounded-xl">
                <FileCheck className="w-12 h-12 text-status-attained mx-auto mb-3" />
                <h4 className="font-bold text-primary">All Reviews Approved!</h4>
                <p className="text-xs text-on-surface-variant mt-1">Excellent job HOD. The current curriculum alignment audits are green.</p>
              </div>
            )}
          </div>

          <button 
            disabled={loadingMore}
            onClick={handleLoadMore}
            className="w-full mt-4 py-3.5 border-2 border-dashed border-outline-variant hover:border-primary rounded-xl text-on-surface-variant hover:text-primary font-sans text-xs font-bold tracking-wider uppercase hover:bg-surface-container-low transition-colors duration-150 flex items-center justify-center gap-1.5"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-secondary" /> RETRIEVING ITEMS FROM REGISTRY...
              </>
            ) : (
              "LOAD 11 MORE PENDING ITEMS"
            )}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
