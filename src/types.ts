export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  studentsCount: number;
  mappedCOs: number;
  syllabusProgress: number; // e.g. 90 for 90%
  attainmentPercent: number; // e.g. 88 for 88%
}

export interface CourseOutcome {
  id: string;
  code: string; // e.g. "CO1"
  description: string;
  bloomsLevel: string; // e.g. "L4 - Analyze"
}

export interface Justification {
  id: string;
  coId: string;
  poId: string;
  strength: number; // 1, 2, 3
  narrative: string;
  isAiDrafted?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'warning' | 'success' | 'info';
  text: string;
  time: string;
}

export interface PendingTask {
  id: string;
  title: string;
  tag: 'URGENT' | 'DUE TODAY' | 'REVIEW';
  description: string;
  actionText: string;
  targetScreen: string; // e.g., 'courses', 'marks-entry', etc.
}

export interface StudentMarkRow {
  id: string;
  studentName: string;
  usn: string;
  q1a: number | string; // Max 5
  q1b: number | string; // Max 5
  q2: number | string;  // Max 10
  q3: number | string;  // Max 10
  total: number;
}

export interface PendingReviewItem {
  id: string;
  type: 'CO MAPPING' | 'COURSE FILE';
  courseCode: string;
  courseName: string;
  facultyName: string;
  timeSubmitted: string;
  details: string[];
  status: 'PENDING' | 'APPROVED' | 'REVIEW';
}
