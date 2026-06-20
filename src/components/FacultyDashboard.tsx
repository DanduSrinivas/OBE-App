import { motion } from "motion/react";
import { 
  Bell, 
  BookOpen, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calendar,
  Layers,
  FileText,
  TrendingUp,
  Award
} from "lucide-react";
import { Course, NotificationItem, PendingTask } from "../types";

interface FacultyDashboardProps {
  courses: Course[];
  notifications: NotificationItem[];
  pendingTasks: PendingTask[];
  onNavigate: (screen: string) => void;
  onSelectCourse: (courseCode: string) => void;
  onTriggerGapAnalysis: () => void;
}

export default function FacultyDashboard({
  courses,
  notifications,
  pendingTasks,
  onNavigate,
  onSelectCourse,
  onTriggerGapAnalysis,
}: FacultyDashboardProps) {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Welcome Header */}
      <section className="mt-4">
        <h1 className="font-display text-3xl font-bold text-primary tracking-tight">Faculty Dashboard</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Welcome back, <span className="font-semibold text-primary">Dr. Aris Thorne</span>. Here is your institutional performance overview.
        </p>
      </section>

      {/* KPI Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Institution PO Attainment Snapshots */}
        <div className="md:col-span-8 glass-card rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-[0.04] pointer-events-none">
            <Layers size={140} className="text-primary" />
          </div>
          <div>
            <h3 className="font-sans font-semibold tracking-wider text-[11px] text-on-surface-variant flex items-center gap-2 mb-4 uppercase">
              <Award className="w-4 h-4 text-status-attained" />
              INSTITUTION-WIDE PO ATTAINMENT SNAPSHOT
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
              <div className="p-3 bg-background/50 rounded-lg border border-data-entry-border hover:border-status-attained transition-all duration-200">
                <span className="font-display font-bold text-3xl text-status-attained block">84%</span>
                <p className="font-sans uppercase text-[9px] font-bold text-on-surface-variant mt-1 leading-tight">PO1: Engineering Knowledge</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-data-entry-border hover:border-status-warning transition-all duration-200">
                <span className="font-display font-bold text-3xl text-status-warning block">62%</span>
                <p className="font-sans uppercase text-[9px] font-bold text-on-surface-variant mt-1 leading-tight">PO2: Problem Analysis</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-data-entry-border hover:border-secondary transition-all duration-200">
                <span className="font-display font-bold text-3xl text-secondary block">78%</span>
                <p className="font-sans uppercase text-[9px] font-bold text-on-surface-variant mt-1 leading-tight">PO3: Design & Development</p>
              </div>
              <div className="p-3 bg-background/50 rounded-lg border border-data-entry-border hover:border-status-attained transition-all duration-200">
                <span className="font-display font-bold text-3xl text-status-attained block">91%</span>
                <p className="font-sans uppercase text-[9px] font-bold text-on-surface-variant mt-1 leading-tight">PO4: Investigation</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-2 flex-1 bg-surface-container rounded-full overflow-hidden flex">
              <div className="bg-status-attained h-full rounded-full" style={{ width: "78%" }}></div>
            </div>
            <span className="font-sans text-xs font-bold text-status-attained bg-status-attained/10 px-2 py-1 rounded">
              78% Target Met
            </span>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-outline-variant/30 pb-3">
            <h3 className="font-sans font-semibold tracking-wider text-[11px] text-on-surface-variant uppercase flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-secondary" /> NOTIFICATIONS
            </h3>
            <span className="bg-primary text-on-primary font-bold text-[10px] px-2.5 py-0.5 rounded-full">
              3 NEW
            </span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[160px] custom-scrollbar pr-1 flex-1">
            {notifications.map((notif) => (
              <div key={notif.id} className="flex gap-3 items-start border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
                {notif.type === 'warning' && <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />}
                {notif.type === 'success' && <CheckCircle className="w-5 h-5 text-status-attained shrink-0" />}
                {notif.type === 'info' && <Info className="w-5 h-5 text-primary shrink-0" />}
                <div>
                  <p className="text-xs font-medium text-on-surface leading-snug">{notif.text}</p>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* My Courses Section */}
        <div className="md:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-5 h-5" /> My Courses
            </h2>
            <button 
              onClick={() => onNavigate('courses')}
              className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors text-xs font-bold tracking-wider uppercase group"
            >
              VIEW ALL <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.slice(0, 2).map((course) => (
              <div 
                key={course.id}
                onClick={() => onSelectCourse(course.code)}
                className="glass-card rounded-xl p-5 hover:border-secondary transition-all hover:-translate-y-1 group cursor-pointer shadow-sm hover:shadow-md duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-sans uppercase text-[9px] font-bold text-on-surface-variant tracking-wider">
                      {course.code} • {course.semester}
                    </p>
                    <h4 className="font-display font-bold text-lg text-primary leading-tight mt-1 group-hover:text-secondary transition-colors duration-200">
                      {course.name}
                    </h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${
                    course.attainmentPercent >= 70 
                      ? "bg-status-attained/10 text-status-attained" 
                      : "bg-status-warning/10 text-status-warning"
                  }`}>
                    {course.attainmentPercent}% ATTAINED
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-bold tracking-wider">
                    <span>SYLLABUS PROGRESS</span>
                    <span>{course.syllabusProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${course.syllabusProgress}%` }}></div>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-medium text-on-surface-variant">
                    {course.studentsCount} Students
                  </span>
                  <span className="px-2 py-1 bg-surface-container-high rounded text-[10px] font-medium text-on-surface-variant">
                    {course.mappedCOs} COs Mapped
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks Section */}
        <div className="md:col-span-4 space-y-4">
          <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2">
            <FileText className="w-5 h-5 text-status-gap" /> Pending Tasks
          </h2>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div 
                key={task.id}
                className={`glass-card p-4 rounded-xl border-l-[5px] bg-white/50 transition-all duration-200 hover:shadow-md ${
                  task.tag === 'URGENT' 
                    ? 'border-status-gap' 
                    : task.tag === 'DUE TODAY' 
                    ? 'border-status-warning' 
                    : 'border-primary'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-primary text-sm leading-tight">{task.title}</h5>
                  <span className={`text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded ${
                    task.tag === 'URGENT' 
                      ? 'bg-status-gap/10 text-status-gap' 
                      : task.tag === 'DUE TODAY' 
                      ? 'bg-status-warning/10 text-status-warning' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {task.tag}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mb-4 leading-normal">
                  {task.description}
                </p>
                <button 
                  onClick={() => {
                    if (task.actionText === "REVIEW AI") {
                      onTriggerGapAnalysis();
                    } else if (task.targetScreen === 'marks-entry') {
                      onNavigate('marks-entry');
                    } else if (task.targetScreen === 'courses') {
                      onNavigate('courses');
                    }
                  }}
                  className={`w-full py-2 rounded text-[11px] font-bold tracking-wider uppercase transition-colors duration-150 active:scale-[0.98] ${
                    task.tag === 'URGENT'
                      ? 'bg-primary text-on-primary hover:bg-primary-container'
                      : task.tag === 'DUE TODAY'
                      ? 'border border-primary text-primary hover:bg-surface-container-high'
                      : 'bg-secondary text-on-secondary hover:bg-secondary-container'
                  }`}
                >
                  {task.actionText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Context Watermark Layout */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.015] flex items-center justify-center overflow-hidden rotate-[-25deg]">
        <div className="grid grid-cols-3 gap-16 whitespace-nowrap select-none font-display">
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
          <span className="text-[140px] font-extrabold text-primary">INSTITUTIONAL AUDIT</span>
        </div>
      </div>
    </motion.div>
  );
}
