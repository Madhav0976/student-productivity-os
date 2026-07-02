import React from "react";
import { Search, X } from "lucide-react";
import { useTaskStore } from "../../store/taskStore";
import { isOverdue } from "../../utils/dates";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "overdue", label: "Overdue" },
  { key: "high", label: "High Priority" },
  { key: "completed", label: "Completed" },
] as const;

export default function TaskToolbar() {
  const { tasks, filter, setFilter, searchQuery, setSearch } = useTaskStore();

  const getFilterCount = (key: string) => {
    if (key === "overdue") {
      return tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed").length;
    }
    return 0;
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <div className="relative w-full">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="inp pl-9 text-sm w-full"
          data-search-input="true"
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon btn-ghost w-5 h-5" aria-label="Clear search">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Filter pills — horizontal scroll on small screens */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {FILTERS.map(({ key, label }) => {
          const count = getFilterCount(key);
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                filter === key
                  ? "bg-brand/10 border border-brand/20 text-brand-600 dark:bg-brand-600/15 dark:border-brand-600/30 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/5 border border-transparent"
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-2xs ${
                  filter === key 
                    ? "bg-brand-500/20 text-brand-700 dark:text-brand-300" 
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                } ${key === "overdue" ? "text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-500/20" : ""}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
