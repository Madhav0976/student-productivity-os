import React from "react";
import { TrendingUp, Clock, Flame, BookOpen } from "lucide-react";

interface StudyProgressProps {
  todayHours: number;
  weeklyHours: number;
  weeklyGoal: number;
  streak: number;
  subjectsStudied: number;
}

export default function StudyProgress({
  todayHours,
  weeklyHours,
  weeklyGoal,
  streak,
  subjectsStudied,
}: StudyProgressProps) {
  const weeklyPct = weeklyGoal > 0 ? Math.min(100, Math.round((weeklyHours / weeklyGoal) * 100)) : 0;
  const fmt = (h: number) => h < 1 ? `${Math.round(h * 60)}m` : `${h.toFixed(1)}h`;

  return (
    <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Weekly Progress</p>
            <p className="text-xs text-slate-500 mt-0.5">Tracking against goal</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-emerald-500 leading-none">
            {weeklyPct}<span className="text-lg font-bold text-emerald-400">%</span>
          </p>
          <p className="text-xs text-slate-500 mt-0.5">of weekly goal</p>
        </div>
      </div>

      {/* Weekly goal bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium">{fmt(weeklyHours)} studied</span>
          <span>Goal: {fmt(weeklyGoal)}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${weeklyPct}%`,
              background: weeklyPct >= 100
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, #10b981, #34d399)",
            }}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 px-5 py-3.5">
          <Clock size={15} className="text-blue-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Today</p>
            <p className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5 leading-none">{fmt(todayHours)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3.5 border-x border-slate-100 dark:border-slate-800/80">
          <Flame size={15} className="text-orange-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Streak</p>
            <p className="text-base font-bold text-orange-600 dark:text-orange-400 mt-0.5 leading-none">{streak}d</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 py-3.5">
          <BookOpen size={15} className="text-purple-500 flex-shrink-0" />
          <div>
            <p className="text-xs text-slate-500 font-medium leading-none">Subjects</p>
            <p className="text-base font-bold text-purple-600 dark:text-purple-400 mt-0.5 leading-none">{subjectsStudied}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
