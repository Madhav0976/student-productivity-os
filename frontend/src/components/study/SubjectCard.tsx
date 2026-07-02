import React from "react";
import { BookOpen } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  totalMinutes: number;
  weeklyMinutes: number;
  weeklyGoalMinutes: number;
  onClick: () => void;
}

export default function SubjectCard({
  subject,
  totalMinutes,
  weeklyMinutes,
  weeklyGoalMinutes,
  onClick,
}: SubjectCardProps) {
  const weeklyPct = weeklyGoalMinutes > 0 ? Math.min(100, Math.round((weeklyMinutes / weeklyGoalMinutes) * 100)) : 0;
  
  const formatHrs = (mins: number) => mins < 60 ? `${mins}m` : `${(mins / 60).toFixed(1)}h`;

  return (
    <div 
      onClick={onClick}
      className="card p-5 cursor-pointer hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-sm transition-all group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
          <BookOpen size={20} className="text-slate-500 group-hover:text-emerald-500 transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">{subject}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{formatHrs(totalMinutes)} total studied</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-medium">Weekly Goal</span>
          <span>{formatHrs(weeklyMinutes)} / {formatHrs(weeklyGoalMinutes)}</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              weeklyPct >= 100 ? "bg-emerald-500" : "bg-emerald-400"
            }`}
            style={{ width: `${weeklyPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
