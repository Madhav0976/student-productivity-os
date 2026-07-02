import { create } from "zustand";
import { api } from "../services/api";
import { Goal } from "../types";

interface GoalState {
  goals: Goal[];
  loading: boolean;
  selectedGoal: Goal | null;
  
  fetch: () => Promise<void>;
  create: (payload: Partial<Goal>) => Promise<Goal>;
  update: (id: string, payload: Partial<Goal>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setSelected: (goal: Goal | null) => void;
  updateProgress: (id: string, progress: number) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  selectedGoal: null,

  fetch: async () => {
    set({ loading: true });
    try {
      const goals = await api.goals();
      set({ goals, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    const goal = await api.createGoal(payload);
    set((s) => ({ goals: [goal, ...s.goals] }));
    return goal;
  },

  update: async (id, payload) => {
    const updated = await api.updateGoal(id, payload);
    set((s) => ({
      goals: s.goals.map((g) => (g._id === id ? updated : g)),
      selectedGoal: s.selectedGoal?._id === id ? updated : s.selectedGoal,
    }));
  },

  remove: async (id) => {
    await api.deleteGoal(id);
    set((s) => ({ goals: s.goals.filter((g) => g._id !== id) }));
  },

  setSelected: (goal) => set({ selectedGoal: goal }),

  updateProgress: async (id, progress) => {
    const status = progress >= 100 ? "Completed" : progress > 0 ? "In Progress" : "Not Started";
    await get().update(id, { progressPercentage: Math.min(100, progress), status });
  },
}));
