import React from "react";
import { Plus } from "lucide-react";

interface TaskHeaderProps {
  total: number;
  completedToday: number;
  dueToday: number;
  highPriority: number;
  onQuickAdd: () => void;
}

export default function TaskHeader({
  total,
  completedToday,
  dueToday,
  highPriority,
  onQuickAdd,
}: TaskHeaderProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-brand-500 font-semibold">
            Workspace
          </p>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">
            Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Organize assignments, placement preparation, coding practice and personal goals from one place.
          </p>
        </div>
        <button
          onClick={onQuickAdd}
          className="btn-brand px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-brand-500/20 transition-all"
        >
          <Plus size={18} />
          New Task
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 dark:!bg-slate-900/50 dark:!border-slate-800 transition-all hover:scale-[1.02]">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
            Total Tasks
          </p>
          <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
            {total}
          </h2>
        </div>

        <div className="card p-4 dark:!bg-slate-900/50 dark:!border-slate-800 transition-all hover:scale-[1.02]">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
            Completed Today
          </p>
          <h2 className="text-2xl font-bold mt-2 text-emerald-500 dark:text-emerald-400">
            {completedToday}
          </h2>
        </div>

        <div className="card p-4 dark:!bg-slate-900/50 dark:!border-slate-800 transition-all hover:scale-[1.02]">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
            Due Today
          </p>
          <h2 className="text-2xl font-bold mt-2 text-amber-500 dark:text-amber-400">
            {dueToday}
          </h2>
        </div>

        <div className="card p-4 dark:!bg-slate-900/50 dark:!border-slate-800 transition-all hover:scale-[1.02]">
          <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
            High Priority
          </p>
          <h2 className="text-2xl font-bold mt-2 text-red-500 dark:text-red-400">
            {highPriority}
          </h2>
        </div>
      </div>
    </div>
  );
}
