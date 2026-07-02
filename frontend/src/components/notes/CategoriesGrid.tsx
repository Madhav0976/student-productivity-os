import React from "react";
import { Hash } from "lucide-react";

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  College: { emoji: "📚", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" },
  Placement: { emoji: "🎯", color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/10", border: "border-pink-200 dark:border-pink-500/20" },
  DSA: { emoji: "💻", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
  Project: { emoji: "🛠️", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
  Personal: { emoji: "📝", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/20" },
};

interface CategoriesGridProps {
  categoryCounts: Record<string, number>;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoriesGrid({ categoryCounts, activeCategory, onSelectCategory }: CategoriesGridProps) {
  const categories = Object.keys(CATEGORY_CONFIG);
  const hasAny = categories.some(cat => (categoryCounts[cat] || 0) > 0);
  if (!hasAny) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Hash size={14} /> Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          const count = categoryCounts[cat] || 0;
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(isActive ? "all" : cat)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                isActive
                  ? `${config.bg} ${config.border} border-2`
                  : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-violet-300"
              }`}
            >
              <span className="text-2xl">{config.emoji}</span>
              <div className="text-center">
                <p className={`text-xs font-bold ${config.color}`}>{cat}</p>
                <p className="text-lg font-black text-slate-900 dark:text-white leading-none mt-0.5">{count}</p>
                <p className="text-[10px] text-slate-400">note{count !== 1 ? "s" : ""}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
