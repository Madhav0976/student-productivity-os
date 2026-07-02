import React, { useState } from "react";
import { Circle, CheckCircle2, Flag, Trash2, ChevronRight, RotateCcw } from "lucide-react";
import { Task } from "../../types";
import { formatDateShort, isOverdue } from "../../utils/dates";

interface TaskCardProps {
  task: Task;
  onSelect: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  selected?: boolean;
  onSelectToggle?: (id: string) => void;
  bulkMode?: boolean;
}

export default function TaskCard({
  task,
  onSelect,
  onToggle,
  onDelete,
  selected = false,
  onSelectToggle,
  bulkMode = false,
}: TaskCardProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const isCompleted = task.status === "Completed";
  const overdue = isOverdue(task.dueDate) && !isCompleted;
  const hasDescription = !!task.description?.trim();

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bulkMode && onSelectToggle) {
      onSelectToggle(task._id);
    } else {
      onToggle(task._id);
    }
  };

  const handleDescToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDescExpanded((v) => !v);
  };

  return (
    <div
      className={`group transition-all duration-150 border-b last:border-b-0 border-[var(--border)] ${
        selected ? "bg-brand-50/60 dark:bg-brand-500/10" : "hover:bg-slate-50 dark:hover:bg-white/[0.03]"
      } ${isCompleted ? "opacity-80" : ""}`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => onSelect(task)}
      >
        {/* Checkbox / Bulk select */}
        <button
          onClick={handleCheckboxClick}
          className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
          aria-label={
            bulkMode
              ? selected ? "Deselect task" : "Select task"
              : isCompleted ? "Mark incomplete" : "Mark complete"
          }
        >
          {bulkMode ? (
            <span
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selected
                  ? "bg-brand-500 border-brand-500"
                  : "border-slate-300 dark:border-slate-600 group-hover:border-brand-400"
              }`}
            >
              {selected && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          ) : isCompleted ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <Circle
              size={20}
              className="text-slate-300 dark:text-slate-600 group-hover:text-brand-500 transition-colors"
            />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span
            className={`text-sm font-medium transition-colors leading-5 ${
              isCompleted
                ? "line-through text-slate-400 dark:text-slate-500"
                : "text-slate-900 dark:text-slate-200"
            }`}
          >
            {task.title}
          </span>
        </div>

        {/* Right meta */}
        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Due date */}
          <span
            className={`text-xs font-medium hidden sm:block ${
              overdue
                ? "text-red-500 dark:text-red-400"
                : isCompleted
                ? "text-slate-400 dark:text-slate-500"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {formatDateShort(task.dueDate)}
          </span>

          {/* Priority badge */}
          <span
            className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${
              task.priority === "High"
                ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                : task.priority === "Medium"
                ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
            }`}
          >
            <Flag size={9} />
            {task.priority}
          </span>

          {/* Description expand toggle */}
          {hasDescription && (
            <button
              onClick={handleDescToggle}
              className={`btn-icon w-6 h-6 transition-all flex-shrink-0 ${
                descExpanded
                  ? "text-brand-500 bg-brand-50 dark:bg-brand-500/10"
                  : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100"
              }`}
              title={descExpanded ? "Collapse description" : "Expand description"}
            >
              <ChevronRight
                size={14}
                className={`transition-transform ${descExpanded ? "rotate-90" : ""}`}
              />
            </button>
          )}

          {/* Restore / Delete */}
          {isCompleted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(task._id);
              }}
              className="btn-icon w-6 h-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-all"
              title="Restore task"
            >
              <RotateCcw size={13} />
            </button>
          ) : null}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task._id);
            }}
            className="btn-icon w-6 h-6 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expandable description */}
      {descExpanded && hasDescription && (
        <div className="px-4 pb-3 ml-11 animate-fade-in">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2.5 border border-slate-100 dark:border-slate-700/60">
            {task.description}
          </p>
          {/* Mobile meta */}
          <div className="flex items-center gap-2 mt-2 sm:hidden">
            <span
              className={`text-xs font-medium ${
                overdue ? "text-red-500" : "text-slate-500"
              }`}
            >
              {formatDateShort(task.dueDate)}
            </span>
            <span
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                task.priority === "High"
                  ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400"
                  : task.priority === "Medium"
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400"
                  : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
              }`}
            >
              <Flag size={9} />
              {task.priority}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
