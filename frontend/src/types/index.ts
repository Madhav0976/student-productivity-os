export type Priority = "Low" | "Medium" | "High";
export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type PlacementStatus = "Applied" | "OA Completed" | "Interview" | "Rejected" | "Offer";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type Platform = "LeetCode" | "Codeforces" | "HackerRank" | "GeeksForGeeks";
export type NoteCategory = "College" | "Placement" | "DSA" | "Project" | "Personal";
export type GoalStatus = "Not Started" | "In Progress" | "Completed";

export interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  graduationYear: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
  updatedAt: string;
}

export interface StudySession {
  _id: string;
  subject: string;
  topic: string;
  duration: number;
  completed: boolean;
  notes: string;
  sessionDate: string;
}

export interface Placement {
  _id: string;
  companyName: string;
  role: string;
  applicationDate: string;
  status: PlacementStatus;
  notes: string;
}

export interface CodingProblem {
  _id: string;
  title: string;
  platform: Platform;
  difficulty: Difficulty;
  topic: string;
  solvedDate: string;
  problemUrl?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  category: NoteCategory;
  updatedAt: string;
}

export interface Goal {
  _id: string;
  goalName: string;
  targetDate: string;
  progressPercentage: number;
  status: GoalStatus;
}

export interface Analytics {
  summary: {
    todayTasks: number;
    studyHours: number;
    codingStreak: number;
    placementProgress: number;
    notesCount: number;
    productivityScore: number;
    goalsCount: number;
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
