import { create } from "zustand";
import { api } from "../services/api";
import { StudySession } from "../types";

interface StudyState {
  sessions: StudySession[];
  loading: boolean;
  timerActive: boolean;
  timerSeconds: number;
  timerSubject: string;
  pomodoroMode: boolean;
  pomodoroPhase: "work" | "break";
  
  fetch: () => Promise<void>;
  create: (payload: Partial<StudySession>) => Promise<StudySession>;
  update: (id: string, payload: Partial<StudySession>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  startTimer: (subject: string) => void;
  stopTimer: () => void;
  tickTimer: () => void;
  togglePomodoro: () => void;
  getTotalHours: () => number;
  getTodayHours: () => number;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  sessions: [],
  loading: false,
  timerActive: false,
  timerSeconds: 0,
  timerSubject: "",
  pomodoroMode: false,
  pomodoroPhase: "work",

  fetch: async () => {
    set({ loading: true });
    try {
      const sessions = await api.studySessions();
      set({ sessions, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    const session = await api.createStudySession(payload);
    set((s) => ({ sessions: [session, ...s.sessions] }));
    return session;
  },

  update: async (id, payload) => {
    const updated = await api.updateStudySession(id, payload);
    set((s) => ({ sessions: s.sessions.map((s) => (s._id === id ? updated : s)) }));
  },

  remove: async (id) => {
    await api.deleteStudySession(id);
    set((s) => ({ sessions: s.sessions.filter((s) => s._id !== id) }));
  },

  startTimer: (subject) => set({ timerActive: true, timerSubject: subject, timerSeconds: 0 }),
  stopTimer: () => set({ timerActive: false }),
  tickTimer: () => set((s) => ({ timerSeconds: s.timerSeconds + 1 })),
  togglePomodoro: () => set((s) => ({ pomodoroMode: !s.pomodoroMode })),

  getTotalHours: () => {
    return get().sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60;
  },

  getTodayHours: () => {
    const today = new Date().toISOString().split("T")[0];
    return get().sessions
      .filter((s) => s.sessionDate?.split("T")[0] === today)
      .reduce((acc, s) => acc + (s.duration || 0), 0) / 60;
  },
}));
