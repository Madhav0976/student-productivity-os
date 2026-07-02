import React from "react";
import { CheckCircle2, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface TaskProgressProps {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}

export default function TaskProgress({ total, completed, pending, overdue }: TaskProgressProps) {
  if (total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-brand-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Progress</p>
            <p className="text-xs text-slate-500 mt-0.5">{total} task{total !== 1 ? "s" : ""} total</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-brand-500 leading-none">{percentage}<span className="text-lg font-bold text-brand-400">%</span></p>
          <p className="text-xs text-slate-500 mt-0.5">complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-4">
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{
              width: `${percentage}%`,
              background: percentage === 100
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, #3b82f6, #6366f1)",
            }}
          >
            <div className="absolute inset-0 bg-white/20 w-[200%] -skew-x-12 animate-[shimmer_2.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5 px-5 py-3.5">
          <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Completed</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 leading-none">{completed}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-x border-slate-100 dark:border-slate-800/80">
          <Clock size={16} className="text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Remaining</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 leading-none">{pending}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-5 py-3.5">
          <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Overdue</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400 mt-0.5 leading-none">{overdue}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
