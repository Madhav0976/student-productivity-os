import React from "react";
import { FolderCode, Activity } from "lucide-react";

interface TopicCardProps {
  topic: string;
  count: number;
  lastActivity: string | null;
}

export default function TopicCard({ topic, count, lastActivity }: TopicCardProps) {
  return (
    <div className="card p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all group flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
          <FolderCode size={18} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate pr-2">{topic}</h4>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Activity size={10} className="text-blue-400" />
            {lastActivity ? new Date(lastActivity).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "No activity"}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{count}</span>
        <span className="text-[10px] uppercase font-bold text-slate-400">Solved</span>
      </div>
    </div>
  );
}
