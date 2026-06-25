// ─── Priority ───────────────────────────────────────────────────────────────
export type Priority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type PlacementStatus = "Dream" | "Applied" | "OA" | "Interview" | "HR" | "Offer" | "Rejected";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "LeetCode" | "Codeforces" | "HackerRank" | "GeeksForGeeks" | "CodeChef" | "AtCoder";
export type NoteCategory = "College" | "Placement" | "DSA" | "Project" | "Personal";
export type GoalStatus = "Not Started" | "In Progress" | "Completed";

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
  avatar?: string;
  bio?: string;
  createdAt?: string;
}

// ─── Task ────────────────────────────────────────────────────────────────────
export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  tags?: string[];
  reminder?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Study ───────────────────────────────────────────────────────────────────
export interface StudySession {
  _id: string;
  subject: string;
  topic: string;
  duration: number; // minutes
  completed: boolean;
  notes: string;
  sessionDate: string;
  createdAt?: string;
}

// ─── Placement ───────────────────────────────────────────────────────────────
export interface Placement {
  _id: string;
  companyName: string;
  role: string;
  applicationDate: string;
  status: PlacementStatus;
  notes: string;
  salary?: string;
  location?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Coding ──────────────────────────────────────────────────────────────────
export interface CodingProblem {
  _id: string;
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  topic: string;
  solvedDate: string;
  problemUrl?: string;
  timeSpent?: number; // minutes
  createdAt?: string;
}

// ─── Notes ───────────────────────────────────────────────────────────────────
export interface Note {
  _id: string;
  title: string;
  content: string;
  category: NoteCategory;
  isPinned?: boolean;
  isFavorite?: boolean;
  tags?: string[];
  updatedAt: string;
  createdAt?: string;
}

// ─── Goals ───────────────────────────────────────────────────────────────────
export interface Goal {
  _id: string;
  goalName: string;
  targetDate: string;
  progressPercentage: number;
  status: GoalStatus;
  description?: string;
  milestones?: { label: string; done: boolean }[];
  weeklyTarget?: number;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface Analytics {
  summary: {
    todayTasks: number;
    studyHours: number;
    codingStreak: number;
    placementProgress: number;
    notesCount: number;
    productivityScore: number;
    goalsCount: number;
    taskCompletionRate?: number;
    deepWorkHours?: number;
    currentStreak?: number;
    longestStreak?: number;
  };
  placement: {
    totalApplications: number;
    successRate: number;
    interviewRate: number;
  };
  charts: {
    studyHours: ChartPoint[];
    codingProgress: ChartPoint[];
    tasksCompleted: ChartPoint[];
    placementActivity: ChartPoint[];
    difficultyDistribution: { name: string; value: number }[];
  };
}

export interface ChartPoint {
  date: string;
  value: number;
}

// ─── UI State ─────────────────────────────────────────────────────────────────
export interface ToastItem {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export type QuickCaptureType = "task" | "goal" | "study" | "coding" | "placement" | "note";

export interface AIInsight {
  id: string;
  message: string;
  type: "tip" | "warning" | "achievement" | "suggestion";
  icon?: string;
}
