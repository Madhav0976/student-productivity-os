import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Task } from "../../types";
import TaskCard from "./TaskCard";

type GroupVariant = "overdue" | "today" | "upcoming" | "completed" | "default";

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onSelect: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  defaultExpanded?: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  variant?: GroupVariant;
  selectedIds?: Set<string>;
  onSelectToggle?: (id: string) => void;
  bulkMode?: boolean;
}

const VARIANT_STYLES: Record<GroupVariant, { label: string; count: string; border: string; dot: string }> = {
  overdue: {
    label: "text-red-600 dark:text-red-400 font-bold",
    count: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    border: "border-red-200 dark:border-red-500/30",
    dot: "bg-red-500",
  },
  today: {
    label: "text-blue-600 dark:text-blue-400 font-bold",
    count: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/30",
    dot: "bg-blue-500",
  },
  upcoming: {
    label: "text-slate-700 dark:text-slate-300 font-semibold",
    count: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    dot: "bg-slate-400",
  },
  completed: {
    label: "text-emerald-600 dark:text-emerald-400 font-semibold",
    count: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  default: {
    label: "text-slate-700 dark:text-slate-300 font-semibold",
    count: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-800",
    dot: "bg-slate-400",
  },
};

const GROUP_EMPTY_MESSAGES: Partial<Record<GroupVariant, { title: string; desc: string }>> = {
  overdue: { title: "No overdue tasks", desc: "You're on schedule! Nothing is overdue." },
  today: { title: "Nothing due today", desc: "Enjoy a clear schedule, or add a task for today." },
  upcoming: { title: "No upcoming tasks", desc: "Plan ahead — add tasks with future due dates." },
  completed: { title: "No completed tasks yet", desc: "Complete tasks to see your progress here." },
};

export default function TaskGroup({
  title,
  tasks,
  onSelect,
  onToggle,
  onDelete,
  defaultExpanded = true,
  emptyMessage,
  emptyDescription,
  variant = "default",
  selectedIds = new Set(),
  onSelectToggle,
  bulkMode = false,
}: TaskGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const styles = VARIANT_STYLES[variant];
  const emptyConfig = GROUP_EMPTY_MESSAGES[variant];

  // Hide empty non-critical groups entirely
  if (tasks.length === 0 && !defaultExpanded) return null;

  const resolvedEmptyTitle = emptyMessage ?? emptyConfig?.title ?? "No tasks";
  const resolvedEmptyDesc = emptyDescription ?? emptyConfig?.desc ?? "";

  return (
    <div className="last:mb-0">
      {/* Group header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2.5 w-full py-2 group hover:opacity-90 transition-opacity focus:outline-none"
      >
        <ChevronDown
          size={15}
          className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ${
            expanded ? "rotate-0" : "-rotate-90"
          }`}
        />
        {/* Color dot */}
        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${styles.dot}`} />
        <span className={`text-sm ${styles.label}`}>{title}</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.count}`}>
          {tasks.length}
        </span>
        <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800/80 ml-1 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors" />
      </button>

      {/* Task list */}
      {expanded && (
        <div
          className={`mb-5 rounded-xl overflow-hidden border shadow-sm ${styles.border} bg-white dark:bg-slate-900/60`}
        >
          {tasks.length === 0 ? (
            <div className="py-8 px-6 text-center">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{resolvedEmptyTitle}</p>
              {resolvedEmptyDesc && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{resolvedEmptyDesc}</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onSelect={onSelect}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  selected={selectedIds.has(task._id)}
                  onSelectToggle={onSelectToggle}
                  bulkMode={bulkMode}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
