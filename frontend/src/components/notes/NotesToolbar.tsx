import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { NoteCategory } from "../../types";

const CATEGORIES: { key: string; label: string; emoji: string }[] = [
  { key: "all", label: "All", emoji: "📋" },
  { key: "College", label: "College", emoji: "📚" },
  { key: "Placement", label: "Placement", emoji: "🎯" },
  { key: "DSA", label: "DSA", emoji: "💻" },
  { key: "Project", label: "Project", emoji: "🛠️" },
  { key: "Personal", label: "Personal", emoji: "📝" },
];

const SORT_OPTIONS = [
  { value: "updated", label: "Last Updated" },
  { value: "created", label: "Date Created" },
  { value: "title", label: "Title A–Z" },
];

interface NotesToolbarProps {
  search: string;
  onSearch: (q: string) => void;
  activeCategory: string;
  onCategory: (cat: string) => void;
  sort: string;
  onSort: (s: string) => void;
  pinnedOnly: boolean;
  onPinnedOnly: (v: boolean) => void;
  count: number;
}

export default function NotesToolbar({
  search, onSearch, activeCategory, onCategory, sort, onSort, pinnedOnly, onPinnedOnly, count,
}: NotesToolbarProps) {
  const hasFilters = search || activeCategory !== "all" || pinnedOnly;

  return (
    <div className="flex flex-col gap-3">
      {/* Search + controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes..."
            data-search-input="true"
            className="inp pl-9 pr-4 text-sm w-full"
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 min-w-[140px]">
          <SlidersHorizontal size={13} className="text-slate-400" />
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="bg-transparent border-none outline-none w-full cursor-pointer text-xs"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Pinned toggle */}
        <button
          onClick={() => onPinnedOnly(!pinnedOnly)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
            pinnedOnly
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-300"
          }`}
        >
          📌 Pinned
        </button>

        {hasFilters && (
          <button
            onClick={() => { onSearch(""); onCategory("all"); onPinnedOnly(false); }}
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 px-2 py-2"
          >
            <X size={13} /> Clear
          </button>
        )}

        <span className="text-xs text-slate-400 dark:text-slate-600 ml-auto">
          {count} note{count !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => onCategory(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === key
                ? "bg-violet-600 text-white shadow-sm shadow-violet-600/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-violet-300"
            }`}
          >
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>
    </div>
  );
}
