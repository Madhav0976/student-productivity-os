import React from "react";
import { Search, Sun, Moon, Bell, Plus, Command } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export default function TopBar() {
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const openCommandPalette = useUIStore((s) => s.openCommandPalette);
  const openQuickCapture = useUIStore((s) => s.openQuickCapture);
  const user = useAuthStore((s) => s.user);

  return (
    <header className="sticky top-0 z-10 h-[57px] border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md flex items-center px-4 gap-3">
      {/* Search trigger */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 
                   text-slate-500 text-sm hover:text-slate-900 hover:border-slate-300 dark:bg-white/5 dark:border-[var(--border)] dark:text-slate-400 dark:hover:text-white dark:hover:border-slate-600 transition-all duration-150 group"
        id="topbar-search"
        aria-label="Open command palette"
      >
        <Search size={14} className="group-hover:text-slate-900 dark:group-hover:text-white" />
        <span className="hidden sm:inline text-xs">Search anything...</span>
        <div className="hidden sm:flex items-center gap-0.5 ml-2">
          <kbd className="text-2xs bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded px-1 py-0.5 flex items-center gap-0.5">
            <Command size={8} />K
          </kbd>
        </div>
      </button>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={openQuickCapture}
          className="btn-brand btn-sm hidden sm:flex"
          id="topbar-quick-add"
        >
          <Plus size={14} />
          Quick Add
        </button>

        <button
          onClick={toggleTheme}
          className="btn-icon btn-ghost border border-[var(--border)]"
          aria-label="Toggle theme"
          id="topbar-theme"
        >
          {theme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} />}
        </button>

        <button
          className="btn-icon btn-ghost border border-[var(--border)] relative"
          aria-label="Notifications"
          id="topbar-notifications"
        >
          <Bell size={15} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>

        <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity">
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}
