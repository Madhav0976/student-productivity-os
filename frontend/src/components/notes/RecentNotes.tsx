import React from "react";
import { Note } from "../../types";
import { formatRelative } from "../../utils/dates";
import { Clock } from "lucide-react";

const CAT_BADGE: Record<string, string> = {
  College: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
  Placement: "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-500/10",
  DSA: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
  Project: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
  Personal: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-500/10",
};

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

interface RecentNotesProps {
  notes: Note[];
  onClick: (note: Note) => void;
}

export default function RecentNotes({ notes, onClick }: RecentNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="space-y-2">
      {notes.slice(0, 5).map((note) => (
        <div
          key={note._id}
          onClick={() => onClick(note)}
          className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/50 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
              {note.title}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {note.content?.slice(0, 60) || "Empty note"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${CAT_BADGE[note.category] || CAT_BADGE.Personal}`}>
              {note.category}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <Clock size={9} />
              <span>{readingTime(note.content || "")}</span>
              <span>·</span>
              <span>{formatRelative(note.updatedAt)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
