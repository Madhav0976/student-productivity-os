import { create } from "zustand";
import { api } from "../services/api";
import { User } from "../types";

type AuthStatus = "idle" | "checking" | "authenticated" | "unauthenticated";

interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: Record<string, unknown>) => Promise<void>;
  validateSession: () => Promise<boolean>;
  logout: () => void;
}

const storedUser = localStorage.getItem("spo_user");
const storedToken = localStorage.getItem("spo_token");
api.setToken(storedToken);

const parseStoredUser = () => {
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    localStorage.removeItem("spo_user");
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: parseStoredUser(),
  token: storedToken,
  status: storedToken ? "idle" : "unauthenticated",
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await api.login({ email, password });
      api.setToken(data.token);
      localStorage.setItem("spo_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, status: "authenticated", isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  register: async (payload) => {
    set({ isLoading: true });
    try {
      const data = await api.register(payload);
      api.setToken(data.token);
      localStorage.setItem("spo_user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, status: "authenticated", isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  validateSession: async () => {
    const token = localStorage.getItem("spo_token");

    if (!token) {
      api.setToken(null);
      localStorage.removeItem("spo_user");
      set({ user: null, token: null, status: "unauthenticated" });
      return false;
    }

    api.setToken(token);
    set({ status: "checking" });

    try {
      const data = await api.me();
      localStorage.setItem("spo_user", JSON.stringify(data.user));
      set({ user: data.user, token, status: "authenticated" });
      return true;
    } catch {
      api.setToken(null);
      localStorage.removeItem("spo_token");
      localStorage.removeItem("spo_user");
      set({ user: null, token: null, status: "unauthenticated" });
      return false;
    }
  },
  logout: () => {
    api.setToken(null);
    localStorage.removeItem("spo_user");
    set({ user: null, token: null, status: "unauthenticated" });
  }
}));
