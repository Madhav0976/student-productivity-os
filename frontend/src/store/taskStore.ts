import { create } from "zustand";
import { api } from "../services/api";
import { Task } from "../types";

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  selectedTask: Task | null;
  filter: "all" | "today" | "overdue" | "completed" | "high";
  searchQuery: string;
  
  fetch: () => Promise<void>;
  create: (payload: Partial<Task>) => Promise<Task>;
  update: (id: string, payload: Partial<Task>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  toggle: (id: string) => Promise<void>;
  setSelected: (task: Task | null) => void;
  setFilter: (f: TaskState["filter"]) => void;
  setSearch: (q: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,
  filter: "all",
  searchQuery: "",

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await api.tasks();
      set({ tasks, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e.message });
    }
  },

  create: async (payload) => {
    const task = await api.createTask(payload);
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return task;
  },

  update: async (id, payload) => {
    const updated = await api.updateTask(id, payload);
    set((s) => ({ tasks: s.tasks.map((t) => (t._id === id ? updated : t)) }));
    if (get().selectedTask?._id === id) set({ selectedTask: updated });
  },

  remove: async (id) => {
    await api.deleteTask(id);
    set((s) => ({ tasks: s.tasks.filter((t) => t._id !== id) }));
    if (get().selectedTask?._id === id) set({ selectedTask: null });
  },

  toggle: async (id) => {
    const task = get().tasks.find((t) => t._id === id);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    await get().update(id, { status: newStatus });
  },

  setSelected: (task) => set({ selectedTask: task }),
  setFilter: (filter) => set({ filter }),
  setSearch: (searchQuery) => set({ searchQuery }),
}));
