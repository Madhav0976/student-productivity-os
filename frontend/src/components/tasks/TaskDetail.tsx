import React from "react";
import { Task } from "../../types";
import { ArrowLeft, Edit2, Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import Button from "../ui/Button";

interface TaskDetailProps {
  task: Task;
  onBack: () => void;
  onEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: () => Promise<void>;
}

export default function TaskDetail({ task, onBack, onEdit, onDelete, onToggleStatus }: TaskDetailProps) {
  const isCompleted = task.status === "Completed";
  
  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={18} /> Back to tasks
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (confirm("Delete this task?")) onDelete(task._id); }}
            className="btn-icon w-9 h-9 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={16} />
          </button>
          <Button variant="primary" onClick={onEdit} className="gap-2 ml-2 bg-blue-600 hover:bg-blue-700 border-blue-600">
            <Edit2 size={16} /> Edit Task
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold ${isCompleted ? "text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600" : "text-slate-900 dark:text-white"}`}>
            {task.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
            task.priority === "High" ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" :
            task.priority === "Medium" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
            "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
          }`}>
            {task.priority} Priority
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-xs uppercase tracking-wider">
            {task.status}
          </span>
          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap font-sans mb-12">
          {task.description || <span className="text-slate-400 italic">No description provided.</span>}
        </div>

        <button
          onClick={onToggleStatus}
          className={`w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all font-bold text-base ${
            isCompleted
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600/40 dark:bg-emerald-500/10 dark:text-emerald-400 hover:border-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span>Task Completed — Click to Reopen</span>
              <RotateCcw size={16} className="opacity-60" />
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              <span>Mark Task as Complete</span>
            </>
          )}
        </button>

        {/* Future Comments Placeholder */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Comments</h3>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-sm text-center border border-dashed border-slate-200 dark:border-slate-700">
            Comments coming in a future update.
          </div>
        </div>

      </div>
    </div>
  );
}
