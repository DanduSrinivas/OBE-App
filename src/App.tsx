import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  Layers, 
  FolderLock, 
  BarChart2, 
  Sparkles, 
  Layers3, 
  User, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X,
  Bell,
  Code2,
  Loader2
} from "lucide-react";
import FacultyDashboard from "./components/FacultyDashboard";
import CourseOutcomesMapping from "./components/CourseOutcomesMapping";
import MarksEntryAssessment from "./components/MarksEntryAssessment";
import AttainmentAnalytics from "./components/AttainmentAnalytics";
import DepartmentApprovalQueue from "./components/DepartmentApprovalQueue";

import { Course, NotificationItem, PendingTask, StudentMarkRow, CourseOutcome, Justification } from "./types";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom states that feed down to screens
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", code: "CS304", name: "Database Management Systems", semester: "Semester V", studentsCount: 64, mappedCOs: 4, syllabusProgress: 90, attainmentPercent: 88 },
    { id: "2", code: "CS301", name: "Design & Analysis of Algorithms", semester: "Semester V", studentsCount: 58, mappedCOs: 6, syllabusProgress: 75, attainmentPercent: 54 },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: "notif-1", type: "warning", text: "Internal Assessment 2 deadline in 24h", time: "2 mins ago" },
    { id: "notif-2", type: "success", text: "CO-PO Mapping for CS201 approved", time: "1 hour ago" },
    { id: "notif-3", type: "info", text: "Institutional Audit scheduled for Nov 12", time: "4 hours ago" },
  ]);

  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([
    { id: "task-1", title: "CO Mapping Update", tag: "URGENT", description: "Map Course Outcomes for 'AI & Ethics' elective to institutional POs.", actionText: "START MAPPING", targetScreen: "courses" },
    { id: "task-2", title: "Marks Entry: Lab Exam", tag: "DUE TODAY", description: "Finalize marks for Computer Networks Lab (Batch B).", actionText: "OPEN DATA ENTRY", targetScreen: "marks-entry" },
    { id: "task-3", title: "Syllabus Justification", tag: "REVIEW", description: "AI generated 2 curriculum gap narratives for your review.", actionText: "REVIEW AI", targetScreen: "dashboard" }
  ]);

  const [students, setStudents] = useState<StudentMarkRow[]>([
    { id: "st-1", studentName: "Nisha Sharma", usn: "1MS21CS045", q1a: 4, q1b: 3.5, q2: 8, q3: 7, total: 22.5 },
    { id: "st-2", studentName: "Brijesh V.", usn: "1MS21CS012", q1a: 6, q1b: 4, q2: 9, q3: 8, total: 27 }, // Trigger exceeding limit error simulation
    { id: "st-3", studentName: "Ananya Iyer", usn: "1MS21CS008", q1a: 5, q1b: 5, q2: 10, q3: 10, total: 30 },
    { id: "st-4", studentName: "Rahul Dravid", usn: "1MS21CS089", q1a: 3, q1b: 4, q2: 7, q3: 5, total: 19 },
    { id: "st-5", studentName: "Pooja Patil", usn: "1MS21CS061", q1a: 4.5, q1b: 4.5, q2: 8, q3: "AB", total: 17 },
    { id: "st-6", studentName: "Vikram Sen", usn: "1MS21CS110", q1a: 2, q1b: 3, q2: 6, q3: 7, total: 18 },
    { id: "st-7", studentName: "Sana Khan", usn: "1MS21CS094", q1a: 4, q1b: 4.5, q2: 9, q3: 8.5, total: 26 }
  ]);

  const [cos, setCos] = useState<CourseOutcome[]>([
    { id: "co-1", code: "CO1", description: "Analyze complex database requirements and design appropriate Entity-Relationship models to represent real-world scenarios.", bloomsLevel: "L4 - Analyze" },
    { id: "co-2", code: "CO2", description: "Implement normalized database schemas using Structured Query Language (SQL) for efficient relational transactional storage.", bloomsLevel: "L3 - Apply" },
    { id: "co-3", code: "CO3", description: "Evaluate query execution metrics and optimize physical indexes to satisfy high throughput enterprise workloads.", bloomsLevel: "L5 - Evaluate" }
  ]);

  const [justifications, setJustifications] = useState<Justification[]>([
    { id: "just-1", coId: "CO1", poId: "PO1", strength: 2, narrative: "Entity-Relationship diagram concepts align with primary engineering problem solving models." },
    { id: "just-2", coId: "CO2", poId: "PO3", strength: 3, narrative: "Core course mini-project requiring norm schema design maps directly to real-world software design outcomes.", isAiDrafted: true },
    { id: "just-3", coId: "CO3", poId: "PO4", strength: 1, narrative: "Indexing execution is verified during hands-on lab experiments but represents low percentage of written exams." }
  ]);

  const [aiAnalysisDrawerOpen, setAiAnalysisDrawerOpen] = useState(false);
  const [aiGaps, setAiGaps] = useState<any[]>([]);
  const [gapsLoading, setGapsLoading] = useState(false);

  // Trigger Gemini-powered syllabus gap analysis
  const handleTriggerGapAnalysis = async () => {
    setAiAnalysisDrawerOpen(true);
    setGapsLoading(true);
    try {
      const response = await fetch("/api/ai/syllabus-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName: "Database Management Systems" })
      });
      const data = await response.json();
      if (data.success && data.gaps) {
        setAiGaps(data.gaps);
      }
    } catch (err) {
      console.error(err);
      // Offline backup gaps
      setAiGaps([
        {
          id: "gap-1",
          title: "Syllabus Justification: Distributed NoSQL Gaps",
          tag: "REVIEW",
          description: "AI identified a secondary curriculum gap: The current relational outline neglects distributed non-relational clustering paradigms.",
          actionText: "ADOPT SUGGESTION",
          targetScreen: "courses"
        },
        {
          id: "gap-2",
          title: "Syllabus Justification: Performance Metrics",
          tag: "REVIEW",
          description: "AI identified a critical performance trend gap: Index-optimization is currently only evaluated in theoretical exam segments rather than active lab benchmarking.",
          actionText: "REVIEW AI",
          targetScreen: "courses"
        }
      ]);
    } finally {
      setGapsLoading(false);
    }
  };

  const handleSelectCourse = (courseCode: string) => {
    setActiveScreen("courses");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-background antialiased selection:bg-secondary/20 font-sans">
      
      {/* Top Navigation Header Profile */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-data-entry-border flex items-center justify-between px-6 py-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1.5 hover:bg-surface-container rounded-lg text-primary mr-1"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => setActiveScreen("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-md select-none">
              <span className="text-white font-display font-black text-sm">OBE</span>
            </div>
            <div>
              <span className="font-display font-black text-lg text-primary tracking-tight">OBE Platform</span>
              <span className="hidden sm:inline-block bg-primary-fixed text-on-primary-fixed-variant text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded ml-2 uppercase">
                AUDIT COMPLIANT
              </span>
            </div>
          </div>
        </div>

        {/* Global actions and user info snapshot */}
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-attained animate-ping"></span>
            <span className="text-xs font-semibold text-on-surface-variant flex items-center gap-1">
              Active Context: <span className="font-bold text-primary">Dr. Aris Thorne</span>
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center shadow-xs border border-data-entry-border">
            AT
          </div>
        </div>
      </header>

      {/* Main Body Container: Drawer Sidebar + Content Panel */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Drawer Sidebar (Desktop Persistent) */}
        <aside className="hidden md:flex flex-col w-64 border-r border-data-entry-border bg-white p-5 space-y-7 shrink-0">
          
          {/* Menu Items selection */}
          <div className="space-y-1.5 flex-1">
            <p className="font-sans font-bold text-[9px] text-on-surface-variant/70 tracking-wider uppercase mb-3 px-3">
              FACULTY MENU
            </p>
            
            <button 
              onClick={() => setActiveScreen("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                activeScreen === 'dashboard' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Home className="w-4.5 h-4.5" />
              Faculty Dashboard
            </button>

            <button 
              onClick={() => setActiveScreen("courses")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                activeScreen === 'courses' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Layers className="w-4.5 h-4.5" />
              Outcomes &amp; Mapping
            </button>

            <button 
              onClick={() => setActiveScreen("marks-entry")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                activeScreen === 'marks-entry' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <Code2 className="w-4.5 h-4.5" />
              Marks &amp; Assessment
            </button>

            <button 
              onClick={() => setActiveScreen("analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                activeScreen === 'analytics' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
              }`}
            >
              <BarChart2 className="w-4.5 h-4.5" />
              Attainment Analytics
            </button>

            <div className="pt-4 border-t border-data-entry-border/70 mt-4">
              <p className="font-sans font-bold text-[9px] text-on-surface-variant/70 tracking-wider uppercase mb-3 px-3">
                ADMINISTRATION OR HOD
              </p>
              <button 
                onClick={() => setActiveScreen("approvals")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold font-sans tracking-wide transition-colors ${
                  activeScreen === 'approvals' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                }`}
              >
                <span className="flex items-center gap-3">
                  <FolderLock className="w-4.5 h-4.5" />
                  Approval Queue
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                  activeScreen === 'approvals' ? 'bg-white text-primary' : 'bg-status-warning text-white'
                }`}>
                  3
                </span>
              </button>
            </div>
          </div>

          {/* Quick Stats sidebar context block */}
          <div className="p-3 bg-surface-container-low rounded-xl border border-data-entry-border relative">
            <span className="bg-secondary text-white text-[8px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded absolute -top-2 left-3">
              LIVE PORTAL
            </span>
            <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans font-medium mt-1">
              OBE Alignment score for CSE is currently at <strong className="text-secondary">84.2%</strong>. Target Audit: Dec 2026.
            </p>
          </div>
        </aside>

        {/* Content Box Panel */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full pb-28 md:pb-12">
          
          {activeScreen === "dashboard" && (
            <FacultyDashboard 
              courses={courses}
              notifications={notifications}
              pendingTasks={pendingTasks}
              onNavigate={setActiveScreen}
              onSelectCourse={handleSelectCourse}
              onTriggerGapAnalysis={handleTriggerGapAnalysis}
            />
          )}

          {activeScreen === "courses" && (
            <CourseOutcomesMapping 
              courseCode="CS304"
              courseName="Database Management Systems"
              initialCOs={cos}
              initialJustifications={justifications}
            />
          )}

          {activeScreen === "marks-entry" && (
            <MarksEntryAssessment 
              onBack={() => setActiveScreen("dashboard")}
              initialStudents={students}
            />
          )}

          {activeScreen === "analytics" && (
            <AttainmentAnalytics />
          )}

          {activeScreen === "approvals" && (
            <DepartmentApprovalQueue />
          )}

        </main>
      </div>

      {/* Mobile Menu Slide drawer overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex">
          <motion.div 
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            className="w-64 bg-white h-full p-5 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-data-entry-border">
                <span className="font-display font-black text-primary text-base">OBE Platform</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-on-surface-variant hover:text-red-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <button 
                  onClick={() => { setActiveScreen("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded transition-colors text-xs font-bold ${
                    activeScreen === 'dashboard' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Home className="w-4 h-4" /> Faculty Dashboard
                </button>
                <button 
                  onClick={() => { setActiveScreen("courses"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded transition-colors text-xs font-bold ${
                    activeScreen === 'courses' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Layers className="w-4 h-4" /> Outcomes Mapping
                </button>
                <button 
                  onClick={() => { setActiveScreen("marks-entry"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded transition-colors text-xs font-bold ${
                    activeScreen === 'marks-entry' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Marks &amp; Assessment
                </button>
                <button 
                  onClick={() => { setActiveScreen("analytics"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 p-2.5 rounded transition-colors text-xs font-bold ${
                    activeScreen === 'analytics' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" /> Attainment Analytics
                </button>
                <button 
                  onClick={() => { setActiveScreen("approvals"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded transition-colors text-xs font-bold ${
                    activeScreen === 'approvals' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <FolderLock className="w-4 h-4" /> Approval Queue
                  </span>
                  <span className="bg-status-warning text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">3</span>
                </button>
              </div>
            </div>

            <div className="border-t border-data-entry-border pt-4">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block">ACTIVE USER</span>
              <span className="font-bold text-primary text-xs mt-1 block">Dr. Aris Thorne</span>
            </div>
          </motion.div>
          <div className="flex-grow" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Interactive Mobile Sticky Footer Navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-data-entry-border flex items-center justify-around py-2 z-40 select-none">
        <button 
          onClick={() => setActiveScreen("dashboard")}
          className={`flex flex-col items-center gap-1.5 p-1 text-[10px] font-bold ${activeScreen === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Home className="w-4.5 h-4.5" />
          <span>Home</span>
        </button>
        <button 
          onClick={() => setActiveScreen("courses")}
          className={`flex flex-col items-center gap-1.5 p-1 text-[10px] font-bold ${activeScreen === 'courses' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Layers className="w-4.5 h-4.5" />
          <span>Courses</span>
        </button>
        <button 
          onClick={() => setActiveScreen("marks-entry")}
          className={`flex flex-col items-center gap-1.5 p-1 text-[10px] font-bold ${activeScreen === 'marks-entry' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <Code2 className="w-4.5 h-4.5" />
          <span>Marks</span>
        </button>
        <button 
          onClick={() => setActiveScreen("analytics")}
          className={`flex flex-col items-center gap-1.5 p-1 text-[10px] font-bold ${activeScreen === 'analytics' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <BarChart2 className="w-4.5 h-4.5" />
          <span>Reports</span>
        </button>
        <button 
          onClick={() => setActiveScreen("approvals")}
          className={`flex flex-col items-center gap-1.5 p-1 text-[10px] font-bold ${activeScreen === 'approvals' ? 'text-primary' : 'text-on-surface-variant'}`}
        >
          <FolderLock className="w-4.5 h-4.5" />
          <span>Queue</span>
        </button>
      </nav>

      {/* AI Analysis Modal Drawer Backdrop */}
      <AnimatePresence>
        {aiAnalysisDrawerOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between"
            >
              <div className="space-y-6 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                <div className="flex justify-between items-center pb-3 border-b border-data-entry-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    <h3 className="font-display font-bold text-primary text-lg">AI Curriculum Audit</h3>
                  </div>
                  <button 
                    onClick={() => setAiAnalysisDrawerOpen(false)}
                    className="p-1 px-2 text-on-surface-variant hover:text-red-600 rounded text-xs font-bold"
                  >
                    Close
                  </button>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The model analyzed current syllabus structures against industrial development standards and identified gaps:
                </p>

                {gapsLoading ? (
                  <div className="py-20 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-secondary mx-auto" />
                    <p className="text-xs text-on-surface-variant font-medium">Drafting smart syllabus alignments...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiGaps.map((gap, idx) => (
                      <div key={idx} className="p-4 border border-data-entry-border rounded-xl space-y-3 bg-primary-container/5 relative">
                        <div className="flex justify-between items-center">
                          <span className="font-display font-bold text-sm text-primary leading-tight">{gap.title}</span>
                          <span className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide">{gap.tag}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {gap.description}
                        </p>
                        <button 
                          onClick={() => {
                            setAiAnalysisDrawerOpen(false);
                            setActiveScreen("courses");
                          }}
                          className="w-full py-1.5 bg-secondary text-white font-sans text-xs font-bold tracking-wide rounded hover:opacity-95 transition-all text-center uppercase"
                        >
                          {gap.actionText || "RESOLVE ACTION"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-data-entry-border">
                <button 
                  onClick={() => setAiAnalysisDrawerOpen(false)}
                  className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold tracking-wider uppercase rounded-lg transition-colors"
                >
                  Approve Gap Assessments
                </button>
              </div>
            </motion.div>
            <div className="flex-1 hidden md:block" onClick={() => setAiAnalysisDrawerOpen(false)}></div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
