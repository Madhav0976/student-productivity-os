import React from "react";
import { Placement } from "../../types";
import { ArrowLeft, Edit2, Trash2, Calendar, Briefcase, ChevronRight } from "lucide-react";
import Button from "../ui/Button";

interface PlacementDetailProps {
  placement: Placement;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function PlacementDetail({ placement, onBack, onEdit, onDelete }: PlacementDetailProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Back to placements"
        >
          <ArrowLeft size={18} /> Back to placements
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Delete this application?")) onDelete(placement._id); }}
            className="btn-icon w-9 h-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Delete Application"
            aria-label="Delete Application"
          >
            <Trash2 size={16} />
          </button>
          <Button variant="primary" onClick={onEdit} className="gap-2 ml-2 bg-pink-600 hover:bg-pink-700 border-pink-600 text-white">
            <Edit2 size={16} /> Edit Application
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
              {placement.companyName}
            </h1>
            <p className="text-xl font-medium text-pink-600 dark:text-pink-400">
              {placement.role}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 ${
            placement.status === "Applied" ? "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400" :
            placement.status === "OA" ? "bg-purple-50 border-purple-200 text-purple-600 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-400" :
            placement.status === "Interview" ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400" :
            placement.status === "Offer" ? "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400" :
            "bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
          }`}>
            {placement.status}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <span className="flex items-center gap-1.5 font-medium bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <Calendar size={15} /> Applied on {new Date(placement.applicationDate).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5 font-medium bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <Briefcase size={15} /> Application ID: {placement._id.slice(-6).toUpperCase()}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Application Notes & Timeline</h3>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {placement.notes || <span className="text-slate-400 italic">No notes, links, or timeline logged.</span>}
        </div>
      </div>
    </div>
  );
}
