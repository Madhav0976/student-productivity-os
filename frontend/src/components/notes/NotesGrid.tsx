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
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

interface NoteCardProps {
  note: Note;
  onClick: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export function NoteCard({ note, onClick, onTogglePin }: NoteCardProps) {
  const badgeClass = CAT_BADGE[note.category] || CAT_BADGE.Personal;

  return (
    <div
      onClick={() => onClick(note)}
      className="group bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 cursor-pointer hover:border-violet-300 dark:hover:border-violet-500/50 hover:shadow-md transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 flex-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {note.title}
        </h3>
        {note.isPinned && (
          <span className="text-amber-400 flex-shrink-0 mt-0.5">📌</span>
        )}
      </div>

      {/* Preview Removed */}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${badgeClass}`}>
          {note.category}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><Clock size={10} />{readingTime(note.content || "")}</span>
          <span>·</span>
          <span>{formatRelative(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}

interface NotesGridProps {
  notes: Note[];
  onClick: (note: Note) => void;
  onTogglePin: (id: string) => void;
}

export default function NotesGrid({ notes, onClick, onTogglePin }: NotesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onClick={onClick} onTogglePin={onTogglePin} />
      ))}
    </div>
  );
}
