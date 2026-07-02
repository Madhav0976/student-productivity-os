import React from "react";

interface DifficultyOverviewProps {
  easy: number;
  medium: number;
  hard: number;
}

export default function DifficultyOverview({ easy, medium, hard }: DifficultyOverviewProps) {
  const total = easy + medium + hard;
  const getPct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div className="card p-5 dark:!bg-slate-900/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Difficulty Distribution</h3>
      <div className="space-y-4">
        <DiffBar label="Easy" count={easy} pct={getPct(easy)} color="bg-emerald-500" textColor="text-emerald-500" />
        <DiffBar label="Medium" count={medium} pct={getPct(medium)} color="bg-amber-500" textColor="text-amber-500" />
        <DiffBar label="Hard" count={hard} pct={getPct(hard)} color="bg-red-500" textColor="text-red-500" />
      </div>
    </div>
  );
}

function DiffBar({ label, count, pct, color, textColor }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className={textColor}>{label}</span>
        <span className="text-slate-500 dark:text-slate-400">{count} <span className="font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
