import React from "react";
import { BookOpen, Clock, Flame, BarChart2, Plus } from "lucide-react";

interface StudyHeaderProps {
  todayHours: number;
  weeklyHours: number;
  weeklyGoal: number;
  streak: number;
  subjectCount: number;
  onQuickAdd: () => void;
}

export default function StudyHeader({
  todayHours,
  weeklyHours,
  weeklyGoal,
  streak,
  subjectCount,
  onQuickAdd,
}: StudyHeaderProps) {
  const fmt = (h: number) => h < 1 ? `${Math.round(h * 60)}m` : `${h.toFixed(1)}h`;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Title row */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-500 font-semibold">Workspace</p>
          <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white mt-2">Study Planner</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Track sessions, build study streaks, and know exactly what needs attention.
          </p>
        </div>
        <button
          onClick={onQuickAdd}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Log Session
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock size={18} className="text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-500/10"
          label="Today"
          value={fmt(todayHours)}
          sub="studied"
        />
        <StatCard
          icon={<BarChart2 size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-500/10"
          label="This Week"
          value={fmt(weeklyHours)}
          sub={`of ${fmt(weeklyGoal)} goal`}
          accent={weeklyHours >= weeklyGoal ? "text-emerald-500" : undefined}
        />
        <StatCard
          icon={<Flame size={18} className="text-orange-500" />}
          bg="bg-orange-50 dark:bg-orange-500/10"
          label="Study Streak"
          value={`${streak}d`}
          sub="consecutive days"
          accent={streak >= 7 ? "text-orange-500" : undefined}
        />
        <StatCard
          icon={<BookOpen size={18} className="text-purple-500" />}
          bg="bg-purple-50 dark:bg-purple-500/10"
          label="Subjects"
          value={String(subjectCount)}
          sub="tracked"
        />
      </div>
    </div>
  );
}

function StatCard({
  icon, bg, label, value, sub, accent,
}: {
  icon: React.ReactNode;
  bg: string;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.02] shadow-sm">
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{label}</p>
      <p className={`text-2xl font-black mt-1 ${accent || "text-slate-900 dark:text-white"}`}>{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}
