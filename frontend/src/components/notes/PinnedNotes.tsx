import React from "react";
import { Note } from "../../types";
import { Pin, X } from "lucide-react";
import { formatRelative } from "../../utils/dates";

const CAT_COLORS: Record<string, string> = {
  College: "from-blue-500/20 to-blue-600/5 border-blue-200 dark:border-blue-500/20",
  Placement: "from-pink-500/20 to-pink-600/5 border-pink-200 dark:border-pink-500/20",
  DSA: "from-amber-500/20 to-amber-600/5 border-amber-200 dark:border-amber-500/20",
  Project: "from-emerald-500/20 to-emerald-600/5 border-emerald-200 dark:border-emerald-500/20",
  Personal: "from-purple-500/20 to-purple-600/5 border-purple-200 dark:border-purple-500/20",
};

interface PinnedNotesProps {
  notes: Note[];
  onClick: (note: Note) => void;
  onUnpin: (id: string) => void;
}

export default function PinnedNotes({ notes, onClick, onUnpin }: PinnedNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Pin size={14} className="text-amber-500" />
        <h2 className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Pinned ({notes.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {notes.map((note) => (
          <div
            key={note._id}
            onClick={() => onClick(note)}
            className={`relative cursor-pointer rounded-xl border bg-gradient-to-br p-4 transition-all hover:shadow-md hover:scale-[1.01] group ${
              CAT_COLORS[note.category] || CAT_COLORS.Personal
            }`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onUnpin(note._id); }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-full bg-white/60 dark:bg-black/30 text-amber-500 hover:text-amber-700"
              title="Unpin"
            >
              <X size={11} />
            </button>
            <Pin size={12} className="text-amber-500 mb-2" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 pr-5">{note.title}</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
              {note.content || "No content"}
            </p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {note.category}
              </span>
              <span className="text-[10px] text-slate-400">{formatRelative(note.updatedAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
