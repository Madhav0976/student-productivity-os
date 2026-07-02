import React from "react";
import { Note } from "../../types";
import { formatRelative } from "../../utils/dates";
import { ArrowLeft, Edit2, Trash2, Pin, Star, Clock } from "lucide-react";
import Button from "../ui/Button";

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  onTogglePin: (id: string) => Promise<void>;
  onToggleFav: (id: string) => Promise<void>;
}

function readingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function NoteDetail({ note, onBack, onEdit, onDelete, onTogglePin, onToggleFav }: NoteDetailProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to notes
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePin(note._id)}
            className={`btn-icon w-9 h-9 ${note.isPinned ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            title="Toggle Pin"
          >
            <Pin size={16} />
          </button>
          <button
            onClick={() => onToggleFav(note._id)}
            className={`btn-icon w-9 h-9 ${note.isFavorite ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            title="Toggle Favorite"
          >
            <Star size={16} />
          </button>
          <button
            onClick={() => { if (confirm("Delete this note?")) onDelete(note._id); }}
            className="btn-icon w-9 h-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Delete Note"
          >
            <Trash2 size={16} />
          </button>
          <Button variant="primary" onClick={onEdit} className="gap-2 ml-2 bg-violet-600 hover:bg-violet-700 border-violet-600">
            <Edit2 size={16} /> Edit Note
          </Button>
        </div>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{note.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <span className="font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 rounded-md uppercase tracking-wider text-[11px]">
            {note.category}
          </span>
          <span className="flex items-center gap-1.5"><Clock size={14} /> {readingTime(note.content || "")}</span>
          <span>Created {new Date(note.createdAt || note.updatedAt).toLocaleDateString()}</span>
          <span>Updated {formatRelative(note.updatedAt)}</span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {note.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-sans">
        {note.content || <span className="text-slate-400 italic">No content. Click edit to add some.</span>}
      </div>
    </div>
  );
}
