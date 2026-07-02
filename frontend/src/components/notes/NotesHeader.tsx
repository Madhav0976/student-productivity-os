import React from "react";
import { FileText, Pin, BookMarked, Clock, Plus } from "lucide-react";

interface NotesHeaderProps {
  totalNotes: number;
  pinnedCount: number;
  categoriesCount: number;
  lastEdited: string | null;
  onNewNote: () => void;
}

export default function NotesHeader({
  totalNotes,
  pinnedCount,
  categoriesCount,
  lastEdited,
  onNewNote,
}: NotesHeaderProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-violet-500 font-semibold">Workspace</p>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">Notes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Your personal knowledge workspace. Capture, organize, and revisit everything that matters.
          </p>
        </div>
        <button
          onClick={onNewNote}
          id="notes-new-btn"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg shadow-violet-600/20 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FileText size={18} className="text-violet-500" />}
          bg="bg-violet-50 dark:bg-violet-500/10"
          label="Total Notes"
          value={String(totalNotes)}
          sub="all notes"
        />
        <StatCard
          icon={<Pin size={18} className="text-amber-500" />}
          bg="bg-amber-50 dark:bg-amber-500/10"
          label="Pinned"
          value={String(pinnedCount)}
          sub="pinned notes"
          accent={pinnedCount > 0 ? "text-amber-600 dark:text-amber-400" : undefined}
        />
        <StatCard
          icon={<BookMarked size={18} className="text-blue-500" />}
          bg="bg-blue-50 dark:bg-blue-500/10"
          label="Categories"
          value={String(categoriesCount)}
          sub="active categories"
        />
        <StatCard
          icon={<Clock size={18} className="text-emerald-500" />}
          bg="bg-emerald-50 dark:bg-emerald-500/10"
          label="Last Edited"
          value={lastEdited || "—"}
          sub="most recent"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, bg, label, value, sub, accent }: {
  icon: React.ReactNode; bg: string; label: string; value: string; sub: string; accent?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all hover:scale-[1.02] shadow-sm">
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">{label}</p>
      <p className={`text-xl font-black mt-1 truncate ${accent || "text-slate-900 dark:text-white"}`}>{value}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
}
