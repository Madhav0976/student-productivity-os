import React, { useCallback, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "react-router-dom";
import {
  Home, CheckSquare, BookOpen, Target, Code2, Briefcase,
  FileText, Calendar, BarChart3, User, Settings, Plus,
  Moon, Sun, Search, Zap, LogOut
} from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useAuthStore } from "../../store/authStore";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";

const PAGES = [
  { label: "Home", to: "/", icon: Home },
  { label: "Tasks", to: "/tasks", icon: CheckSquare },
  { label: "Study Planner", to: "/study", icon: BookOpen },
  { label: "Goals", to: "/goals", icon: Target },
  { label: "Coding", to: "/coding", icon: Code2 },
  { label: "Placements", to: "/placements", icon: Briefcase },
  { label: "Notes", to: "/notes", icon: FileText },
  { label: "Calendar", to: "/calendar", icon: Calendar },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Profile", to: "/profile", icon: User },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function CommandPalette() {
  const { commandPaletteOpen, closeCommandPalette, openQuickCapture, toggleTheme, theme } = useUIStore();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  useKeyboardShortcut(["ctrl+k", "meta+k"], () => {
    useUIStore.getState().openCommandPalette();
  });

  useKeyboardShortcut("escape", () => {
    if (commandPaletteOpen) closeCommandPalette();
  }, { preventDefault: false });

  const go = useCallback((to: string) => {
    navigate(to);
    closeCommandPalette();
  }, [navigate, closeCommandPalette]);

  if (!commandPaletteOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeCommandPalette} role="dialog" aria-modal aria-label="Command palette">
      <div className="w-full max-w-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <Command className="cmdk-root shadow-float" loop>
          <div className="flex items-center gap-3 px-4 border-b border-[var(--border)]">
            <Search size={16} className="text-slate-500 flex-shrink-0" />
            <Command.Input
              className="cmdk-input flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white text-sm py-4 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Search pages, create items, run actions..."
              autoFocus
            />
            <kbd
              className="text-2xs text-slate-500 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-2 py-1 cursor-pointer hover:bg-slate-200 dark:hover:bg-white/10"
              onClick={closeCommandPalette}
            >
              ESC
            </kbd>
          </div>

          <Command.List className="cmdk-list">
            <Command.Empty className="cmdk-empty">No results found</Command.Empty>

            <Command.Group heading="Navigate" className="cmdk-group-heading">
              {PAGES.map(({ label, to, icon: Icon }) => (
                <Command.Item
                  key={to}
                  value={label}
                  onSelect={() => go(to)}
                  className="cmdk-item"
                >
                  <Icon size={15} className="text-slate-500 flex-shrink-0" />
                  <span>{label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Create" className="cmdk-group-heading">
              {[
                { label: "New Task", type: "task" as const },
                { label: "New Note", type: "note" as const },
                { label: "New Goal", type: "goal" as const },
                { label: "Log Coding Problem", type: "coding" as const },
                { label: "Add Placement", type: "placement" as const },
              ].map(({ label, type }) => (
                <Command.Item
                  key={type}
                  value={label}
                  onSelect={() => { closeCommandPalette(); openQuickCapture(); }}
                  className="cmdk-item"
                >
                  <Plus size={15} className="text-brand-400 flex-shrink-0" />
                  <span>{label}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className="cmdk-group-heading">
              <Command.Item
                value="toggle theme dark light"
                onSelect={() => { toggleTheme(); closeCommandPalette(); }}
                className="cmdk-item"
              >
                {theme === "dark" ? <Sun size={15} className="text-amber-400 flex-shrink-0" /> : <Moon size={15} className="flex-shrink-0" />}
                <span>Toggle theme ({theme === "dark" ? "Light" : "Dark"} mode)</span>
              </Command.Item>
              <Command.Item
                value="logout sign out"
                onSelect={() => { logout(); navigate("/login"); closeCommandPalette(); }}
                className="cmdk-item"
              >
                <LogOut size={15} className="text-red-400 flex-shrink-0" />
                <span className="text-red-400">Sign out</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <div className="px-4 py-2 border-t border-[var(--border)] flex items-center gap-4 bg-slate-50 dark:bg-transparent rounded-b-xl">
            <span className="text-2xs text-slate-500 flex items-center gap-1">
              <kbd className="text-2xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1 text-slate-600 dark:text-slate-400">↑↓</kbd> navigate
            </span>
            <span className="text-2xs text-slate-500 flex items-center gap-1">
              <kbd className="text-2xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1 text-slate-600 dark:text-slate-400">↵</kbd> select
            </span>
            <span className="text-2xs text-slate-500 flex items-center gap-1">
              <kbd className="text-2xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1 text-slate-600 dark:text-slate-400">esc</kbd> close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
