import { Analytics, CodingProblem, Goal, Note, Placement, StudySession, Task, User } from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type AuthResponse = {
  user: User;
  token: string;
};

class ApiClient {
  private token: string | null = localStorage.getItem("spo_token");

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem("spo_token", token);
    else localStorage.removeItem("spo_token");
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    if (this.token) headers.set("Authorization", `Bearer ${this.token}`);

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data as T;
  }

  register(payload: Record<string, unknown>) {
    return this.request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  }

  login(payload: Record<string, unknown>) {
    return this.request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  }

  me() {
    return this.request<{ user: User }>("/auth/me");
  }

  analytics() {
    return this.request<Analytics>("/analytics");
  }

  tasks(query = "") {
    return this.request<Task[]>(`/tasks${query}`);
  }

  createTask(payload: Partial<Task>) {
    return this.request<Task>("/tasks", { method: "POST", body: JSON.stringify(payload) });
  }

  updateTask(id: string, payload: Partial<Task>) {
    return this.request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  }

  deleteTask(id: string) {
    return this.request<{ message: string }>(`/tasks/${id}`, { method: "DELETE" });
  }

  studySessions() {
    return this.request<StudySession[]>("/study");
  }

  createStudySession(payload: Partial<StudySession>) {
    return this.request<StudySession>("/study", { method: "POST", body: JSON.stringify(payload) });
  }

  updateStudySession(id: string, payload: Partial<StudySession>) {
    return this.request<StudySession>(`/study/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  }

  placements() {
    return this.request<Placement[]>("/placements");
  }

  createPlacement(payload: Partial<Placement>) {
    return this.request<Placement>("/placements", { method: "POST", body: JSON.stringify(payload) });
  }

  updatePlacement(id: string, payload: Partial<Placement>) {
    return this.request<Placement>(`/placements/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  }

  codingProblems() {
    return this.request<CodingProblem[]>("/coding");
  }

  createCodingProblem(payload: Partial<CodingProblem>) {
    return this.request<CodingProblem>("/coding", { method: "POST", body: JSON.stringify(payload) });
  }

  notes(query = "") {
    return this.request<Note[]>(`/notes${query}`);
  }

  createNote(payload: Partial<Note>) {
    return this.request<Note>("/notes", { method: "POST", body: JSON.stringify(payload) });
  }

  updateNote(id: string, payload: Partial<Note>) {
    return this.request<Note>(`/notes/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  }

  deleteNote(id: string) {
    return this.request<{ message: string }>(`/notes/${id}`, { method: "DELETE" });
  }

  goals() {
    return this.request<Goal[]>("/goals");
  }

  createGoal(payload: Partial<Goal>) {
    return this.request<Goal>("/goals", { method: "POST", body: JSON.stringify(payload) });
  }

  updateGoal(id: string, payload: Partial<Goal>) {
    return this.request<Goal>(`/goals/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  }
}

export const api = new ApiClient();
