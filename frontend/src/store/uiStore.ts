import { create } from "zustand";

type Theme = "dark" | "light";

interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  commandPaletteOpen: boolean;
  quickCaptureOpen: boolean;
  activeDrawer: { type: string; id: string } | null;
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openQuickCapture: () => void;
  closeQuickCapture: () => void;
  openDrawer: (type: string, id: string) => void;
  closeDrawer: () => void;
}

const storedTheme = (localStorage.getItem("spo_theme") as Theme) || "dark";

// Apply theme on load
if (storedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: storedTheme,
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  quickCaptureOpen: false,
  activeDrawer: null,

  setTheme: (theme) => {
    localStorage.setItem("spo_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },

  toggleTheme: () => {
    const current = get().theme;
    get().setTheme(current === "dark" ? "light" : "dark");
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  openQuickCapture: () => set({ quickCaptureOpen: true }),
  closeQuickCapture: () => set({ quickCaptureOpen: false }),

  openDrawer: (type, id) => set({ activeDrawer: { type, id } }),
  closeDrawer: () => set({ activeDrawer: null }),
}));
