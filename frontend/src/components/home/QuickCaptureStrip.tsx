import React from "react";
import { CheckSquare, Target, Code2, Briefcase, FileText } from "lucide-react";
import { useUIStore } from "../../store/uiStore";

export default function QuickCaptureStrip() {
  const { openQuickCapture } = useUIStore();

  return (
    <div className="card p-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-2xs text-slate-500 font-medium uppercase tracking-wider mr-1">Quick capture:</span>
        {[
          { label: "Task", icon: CheckSquare, color: "text-blue-400" },
          { label: "Goal", icon: Target, color: "text-purple-400" },
          { label: "Problem", icon: Code2, color: "text-amber-400" },
          { label: "Note", icon: FileText, color: "text-slate-300" },
          { label: "Application", icon: Briefcase, color: "text-pink-400" },
        ].map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            onClick={openQuickCapture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 
                       border border-slate-200 dark:border-[var(--border)] hover:border-slate-300 dark:hover:border-slate-600 text-xs text-slate-500 dark:text-slate-400 
                       hover:text-slate-900 dark:hover:text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Icon size={12} className={color} />
            {label}
          </button>
        ))}
        <div className="flex-1 hidden sm:flex justify-end">
          <kbd className="text-2xs text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-2 py-1">
            Q — Quick capture
          </kbd>
        </div>
      </div>
    </div>
  );
}
