import React from "react";

interface WeeklyOverviewProps {
  days: { label: string; hours: number; isToday: boolean }[];
  maxHours: number;
}

export default function WeeklyOverview({ days, maxHours }: WeeklyOverviewProps) {
  const max = Math.max(maxHours, 1); // Avoid division by zero

  return (
    <div className="card p-5 dark:!bg-slate-900/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">Weekly Overview</h3>
      <div className="flex items-end justify-between h-40 gap-2">
        {days.map((day) => {
          const pct = Math.min(100, Math.round((day.hours / max) * 100));
          return (
            <div key={day.label} className="flex flex-col items-center gap-2 flex-1 group">
              <div className="w-full relative flex flex-col justify-end h-32 rounded-lg bg-slate-50 dark:bg-slate-800/50 p-1">
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10 whitespace-nowrap">
                  {day.hours.toFixed(1)}h
                </div>
                {/* Bar */}
                <div
                  className={`w-full rounded-md transition-all duration-700 ease-out ${
                    day.isToday ? "bg-emerald-500" : "bg-emerald-400/60 dark:bg-emerald-500/60 group-hover:bg-emerald-400"
                  }`}
                  style={{ height: `${pct}%`, minHeight: pct > 0 ? "4px" : "0" }}
                />
              </div>
              <span className={`text-xs font-medium ${day.isToday ? "text-emerald-500 font-bold" : "text-slate-500"}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
