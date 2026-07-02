import React from "react";
import { Plus, Code2, Flame, Target, BarChart2 } from "lucide-react";

interface CodingHeaderProps {
  todayCount: number;
  streak: number;
  totalProblems: number;
  weeklyProgress: number;
  weeklyGoal: number;
  onQuickLog: () => void;
}

export default function CodingHeader({
  todayCount,
  streak,
  totalProblems,
  weeklyProgress,
  weeklyGoal,
  onQuickLog,
}: CodingHeaderProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-500 font-semibold">Workspace</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">Coding Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Log algorithms, master data structures, and prepare for interviews.
          </p>
        </div>
        <button
          onClick={onQuickLog}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Log Problem
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Code2 size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-500/10"
          label="Today"
          value={String(todayCount)}
          sub="problems solved"
          accent={todayCount > 0 ? "text-blue-600 dark:text-blue-400" : undefined}
        />
        <StatCard
          icon={<Flame size={18} className="text-orange-500" />}
          bg="bg-orange-50 dark:bg-orange-500/10"
          label="Coding Streak"
          value={`${streak}d`}
          sub="consecutive days"
          accent={streak >= 7 ? "text-orange-600 dark:text-orange-400" : undefined}
        />
        <StatCard
          icon={<Target size={18} className="text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-500/10"
          label="Total Solved"
          value={String(totalProblems)}
          sub="all time"
        />
        <StatCard
          icon={<BarChart2 size={18} className="text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-500/10"
          label="This Week"
          value={`${weeklyProgress}/${weeklyGoal}`}
          sub="problems"
          accent={weeklyProgress >= weeklyGoal ? "text-emerald-600 dark:text-emerald-400" : undefined}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub, accent }: any) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.02] shadow-sm">
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{label}</p>
      <p className={`text-2xl font-black mt-1 ${accent || "text-slate-900 dark:text-white"}`}>{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}
