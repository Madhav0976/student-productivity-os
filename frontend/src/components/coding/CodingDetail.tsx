import React from "react";
import { CodingProblem } from "../../types";
import { ArrowLeft, Edit2, Trash2, ExternalLink, Code2 } from "lucide-react";
import Button from "../ui/Button";

interface CodingDetailProps {
  problem: CodingProblem;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
}

export default function CodingDetail({ problem, onBack, onEdit, onDelete }: CodingDetailProps) {
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to dashboard
        </button>
        <div className="flex items-center gap-2">
          {problem.problemUrl && (
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon w-9 h-9 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
              title="Open Original URL"
              aria-label="Open Original URL"
            >
              <ExternalLink size={16} />
            </a>
          )}
          <button
            onClick={() => { if (confirm("Delete this problem?")) onDelete(problem._id); }}
            className="btn-icon w-9 h-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 ml-2"
            title="Delete Problem"
            aria-label="Delete Problem"
          >
            <Trash2 size={16} />
          </button>
          <Button variant="primary" onClick={onEdit} className="gap-2 ml-2 bg-amber-500 hover:bg-amber-600 border-amber-500 text-white">
            <Edit2 size={16} /> Edit Problem
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            {problem.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-8">
          <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs tracking-wider">
            {problem.platform}
          </span>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            problem.difficulty === "Easy" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
            problem.difficulty === "Medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
            "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
          }`}>
            {problem.difficulty}
          </span>
          {problem.topic && (
            <span className="font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider">
              {problem.topic}
            </span>
          )}
          {problem.language && (
            <span className="font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-md text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Code2 size={14} /> {problem.language}
            </span>
          )}
          <span>{new Date(problem.solvedDate).toLocaleDateString()}</span>
        </div>

        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">My Notes</h3>
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-sans">
          {problem.notes || <span className="text-slate-400 italic">No notes recorded.</span>}
        </div>
      </div>
    </div>
  );
}
