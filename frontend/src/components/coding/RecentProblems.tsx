import React from "react";
import { CodingProblem } from "../../types";

interface RecentProblemsProps {
  problems: CodingProblem[];
  onClick: (problem: CodingProblem) => void;
}

export default function RecentProblems({ problems, onClick }: RecentProblemsProps) {
  if (problems.length === 0) return null;

  return (
    <div className="space-y-3">
      {problems.slice(0, 15).map((p) => {
        const diffColor =
          p.difficulty === "Easy" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10"
          : p.difficulty === "Medium" ? "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10"
          : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10";
          
        return (
          <div
            key={p._id}
            onClick={() => onClick(p)}
            className="p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors flex flex-col gap-2 group"
          >
            <div className="flex justify-between items-start gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {p.title}
              </h4>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex-shrink-0 ${diffColor}`}>
                {p.difficulty}
              </span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {p.platform}
              </span>
              <span className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                {p.topic}
              </span>
              {p.language && (
                <span className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                  {p.language}
                </span>
              )}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
              <span className="truncate max-w-[70%]">{p.notes || "No notes"}</span>
              <span className="flex-shrink-0">
                {new Date(p.solvedDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
