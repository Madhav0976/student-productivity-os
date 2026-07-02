import { create } from "zustand";
import { api } from "../services/api";
import { CodingProblem } from "../types";

interface CodingState {
  problems: CodingProblem[];
  loading: boolean;
  
  fetch: () => Promise<void>;
  create: (payload: Partial<CodingProblem>) => Promise<CodingProblem>;
  update: (id: string, payload: Partial<CodingProblem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getStreak: () => number;
  getTodayCount: () => number;
  getHeatmapData: () => Record<string, number>;
  getDifficultyBreakdown: () => { easy: number; medium: number; hard: number };
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export const useCodingStore = create<CodingState>((set, get) => ({
  problems: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const problems = await api.codingProblems();
      set({ problems, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    const problem = await api.createCodingProblem(payload);
    set((s) => ({ problems: [problem, ...s.problems] }));
    return problem;
  },

  update: async (id, payload) => {
    const updated = await api.updateCodingProblem(id, payload);
    set((s) => ({ problems: s.problems.map((p) => (p._id === id ? updated : p)) }));
  },

  remove: async (id) => {
    await api.deleteCodingProblem(id);
    set((s) => ({ problems: s.problems.filter((p) => p._id !== id) }));
  },

  getTodayCount: () => {
    const today = formatDate(new Date());
    return get().problems.filter((p) => p.solvedDate.split("T")[0] === today).length;
  },

  getStreak: () => {
    const problems = get().problems;
    if (!problems.length) return 0;
    
    const dates = new Set(problems.map((p) => p.solvedDate.split("T")[0]));
    let streak = 0;
    const current = new Date();
    
    while (true) {
      const dateStr = formatDate(current);
      if (dates.has(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  },

  getHeatmapData: () => {
    const data: Record<string, number> = {};
    get().problems.forEach((p) => {
      const date = p.solvedDate.split("T")[0];
      data[date] = (data[date] || 0) + 1;
    });
    return data;
  },

  getDifficultyBreakdown: () => {
    const problems = get().problems;
    return {
      easy: problems.filter((p) => p.difficulty === "Easy").length,
      medium: problems.filter((p) => p.difficulty === "Medium").length,
      hard: problems.filter((p) => p.difficulty === "Hard").length,
    };
  },
}));
