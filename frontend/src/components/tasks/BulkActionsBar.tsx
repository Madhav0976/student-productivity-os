import React from "react";
import { CheckCircle2, Trash2, Flag, X } from "lucide-react";
import { Priority } from "../../types";

interface BulkActionsBarProps {
  selectedCount: number;
  onComplete: () => void;
  onDelete: () => void;
  onChangePriority: (priority: Priority) => void;
  onClear: () => void;
}

export default function BulkActionsBar({
  selectedCount,
  onComplete,
  onDelete,
  onChangePriority,
  onClear,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-2xl shadow-black/40 border border-slate-700 animate-fade-in">
      {/* Count */}
      <span className="text-xs font-bold text-white bg-brand-500 px-2.5 py-1 rounded-full mr-1">
        {selectedCount} selected
      </span>

      <div className="h-5 w-px bg-slate-700" />

      {/* Complete */}
      <button
        onClick={onComplete}
        className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        title="Mark complete"
      >
        <CheckCircle2 size={15} />
        <span className="hidden sm:block">Complete</span>
      </button>

      {/* Priority dropdown */}
      <div className="relative group">
        <button
          className="flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
          title="Set priority"
        >
          <Flag size={15} />
          <span className="hidden sm:block">Priority</span>
        </button>
        {/* Dropdown */}
        <div className="absolute bottom-full mb-2 left-0 hidden group-hover:flex flex-col bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl min-w-[110px]">
          {(["High", "Medium", "Low"] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => onChangePriority(p)}
              className={`text-left px-3 py-2 text-xs font-medium hover:bg-slate-700 transition-colors ${
                p === "High"
                  ? "text-red-400"
                  : p === "Medium"
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        title="Delete selected"
      >
        <Trash2 size={15} />
        <span className="hidden sm:block">Delete</span>
      </button>

      <div className="h-5 w-px bg-slate-700" />

      {/* Clear */}
      <button
        onClick={onClear}
        className="flex items-center text-slate-400 hover:text-white px-1.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        title="Clear selection"
      >
        <X size={15} />
      </button>
    </div>
  );
}
