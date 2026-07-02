import React from "react";
import { Flame, Calendar, Award } from "lucide-react";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  lastPractice: string | null;
}

export default function StreakCard({ currentStreak, longestStreak, lastPractice }: StreakCardProps) {
  return (
    <div className="card p-6 bg-gradient-to-br from-orange-500 to-red-600 border-none shadow-xl shadow-orange-500/20 text-white flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-orange-100 flex items-center gap-2">
          <Flame size={18} className={currentStreak > 0 ? "text-yellow-300 animate-pulse" : "text-orange-300"} /> 
          Streak Activity
        </h3>
        {currentStreak > 0 && <Award size={20} className="text-yellow-300" />}
      </div>
      
      <div className="flex items-end gap-3 mb-6">
        <span className="text-6xl font-black leading-none">{currentStreak}</span>
        <span className="text-orange-200 font-medium mb-1">days</span>
      </div>
      
      <div className="flex flex-col gap-2 text-sm text-orange-100">
        <div className="flex justify-between items-center bg-black/10 px-3 py-2 rounded-lg">
          <span className="flex items-center gap-2"><Flame size={14} /> Longest Streak</span>
          <span className="font-bold">{longestStreak} days</span>
        </div>
        <div className="flex justify-between items-center bg-black/10 px-3 py-2 rounded-lg">
          <span className="flex items-center gap-2"><Calendar size={14} /> Last Practice</span>
          <span className="font-bold">
            {lastPractice ? new Date(lastPractice).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Never"}
          </span>
        </div>
      </div>
    </div>
  );
}
