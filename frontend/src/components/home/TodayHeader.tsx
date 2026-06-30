import React from "react";
import { getDayName, getFullDate, getGreeting } from "../../utils/dates";
import ScoreWidget from "./ScoreWidget";

interface TodayHeaderProps {
  userName?: string;
  overdueCount: number;
  pendingCount: number;
  productivityScore: number;
}

export default function TodayHeader({ userName, overdueCount, pendingCount, productivityScore }: TodayHeaderProps) {
  const firstName = userName?.split(" ")[0] || "Student";
  
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p className="text-slate-500 text-sm font-medium">{getDayName()}, {getFullDate()}</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
          {getGreeting()}, {firstName} 👋
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          {overdueCount > 0
            ? `You have ${overdueCount} overdue task${overdueCount > 1 ? "s" : ""} — let's catch up.`
            : pendingCount === 0
            ? "All caught up for today! Great job."
            : `You're on track. ${pendingCount} task${pendingCount !== 1 ? "s" : ""} remaining today.`
          }
        </p>
      </div>
      <ScoreWidget score={productivityScore} />
    </div>
  );
}
