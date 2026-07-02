import React from "react";
import { StudySession } from "../../types";
import { ArrowLeft, Edit2, Trash2, Clock, Calendar } from "lucide-react";
import Button from "../ui/Button";

interface StudyDetailProps {
  session: StudySession;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function StudyDetail({ session, onBack, onEdit, onDelete }: StudyDetailProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Back to study list"
        >
          <ArrowLeft size={18} /> Back to study
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Delete this session?")) onDelete(session._id); }}
            className="btn-icon w-9 h-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Delete Session"
            aria-label="Delete Session"
          >
            <Trash2 size={16} />
          </button>
          <Button variant="primary" onClick={onEdit} className="gap-2 ml-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600" aria-label="Edit Session">
            <Edit2 size={16} /> Edit Session
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
          {session.subject}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6">
          <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-md uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Calendar size={14} /> {new Date(session.sessionDate).toLocaleDateString()}
          </span>
          <span className="font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-md uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Clock size={14} /> {session.duration} mins
          </span>
          {session.topic && (
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-xs">
              Topic: {session.topic}
            </span>
          )}
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {session.notes || <span className="text-slate-400 italic">No notes recorded for this session.</span>}
        </div>
      </div>
    </div>
  );
}
