import React, { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Filter, CheckSquare, Calendar, Flag, Trash2,
  ChevronDown, SortAsc, X, Circle, CheckCircle2, Edit3, 
  AlarmClock, Tag, MoreHorizontal, Archive
} from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import { useUIStore } from "../store/uiStore";
import { Task, Priority } from "../types";
import Drawer from "../components/shared/Drawer";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonRow } from "../components/ui/Skeleton";
import { formatDateShort, isOverdue } from "../utils/dates";
import toast from "react-hot-toast";
import { isToday, isTomorrow, isPast, parseISO, isThisWeek } from "date-fns";
import { useDebounce } from "../hooks/useDebounce";

const PRIORITY_COLORS: Record<Priority, string> = {
  High: "text-red-400",
  Medium: "text-amber-400",
  Low: "text-emerald-400",
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "today", label: "Today" },
  { key: "overdue", label: "Overdue" },
  { key: "high", label: "High Priority" },
  { key: "completed", label: "Completed" },
] as const;

function TaskDetailDrawer({ task, onClose, onUpdate, onDelete }: {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate?.split("T")[0] || "");
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await onUpdate(task._id, { title, description, priority, dueDate, status });
      toast.success("Task updated");
    } catch { toast.error("Failed to update"); }
    setSaving(false);
  };

  const remove = async () => {
    if (!confirm("Delete this task?")) return;
    await onDelete(task._id);
    toast.success("Task deleted");
    onClose();
  };

  return (
    <Drawer open onClose={onClose} title="Task Details">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-2xs text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="inp text-base font-medium"
            placeholder="Task title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-2xs text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="inp resize-none min-h-[80px]"
            placeholder="Add details..."
            rows={3}
          />
        </div>

        {/* Priority + Status row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-2xs text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="inp"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="text-2xs text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="inp"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="text-2xs text-slate-500 font-medium uppercase tracking-wider block mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="inp"
          />
        </div>

        {/* Meta */}
        <div className="text-2xs text-slate-600 space-y-1 pt-2 border-t border-[var(--border)]">
          <p>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(task.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Footer */}
      <div slot="footer" className="flex items-center justify-between gap-2 flex-wrap">
        <button onClick={remove} className="btn-danger btn-sm">
          <Trash2 size={13} /> Delete
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="btn-outline btn-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-brand btn-sm">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </Drawer>
  );
}

function AddTaskRow({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");

  const submit = async () => {
    if (!title.trim()) return;
    await onAdd(title);
    setTitle("");
    setActive(false);
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-500 hover:text-slate-300 
                   hover:bg-white/5 transition-all duration-150 text-sm group"
        id="tasks-add-new"
      >
        <Plus size={14} className="text-brand-500 group-hover:text-brand-400" />
        Add task
      </button>
    );
  }

  return (
    <div className="px-4 py-3 border border-brand-600/30 rounded-lg mx-3 mb-2 bg-brand-600/5 animate-slide-in-up">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task name"
        className="inp mb-2 text-sm"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setActive(false);
        }}
      />
      <div className="flex items-center gap-2 flex-wrap">
        <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="inp !py-1 text-xs w-auto">
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="inp !py-1 text-xs w-auto" />
        <div className="flex-1" />
        <button onClick={() => setActive(false)} className="btn-ghost btn-sm"><X size={13} /></button>
        <button onClick={submit} disabled={!title.trim()} className="btn-brand btn-sm">Add</button>
      </div>
    </div>
  );
}

export default function Tasks() {
  const { tasks, loading, fetch, create, update, remove, toggle, filter, setFilter, searchQuery, setSearch } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 250);

  useEffect(() => { fetch(); }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;
    
    // Apply search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    // Apply filter
    switch (filter) {
      case "today": result = result.filter((t) => isToday(parseISO(t.dueDate))); break;
      case "overdue": result = result.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed"); break;
      case "high": result = result.filter((t) => t.priority === "High"); break;
      case "completed": result = result.filter((t) => t.status === "Completed"); break;
    }
    
    return result.sort((a, b) => {
      if (a.status === "Completed" && b.status !== "Completed") return 1;
      if (b.status === "Completed" && a.status !== "Completed") return -1;
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [tasks, filter, debouncedSearch]);

  const handleAdd = async (title: string) => {
    await create({
      title,
      priority: "Medium",
      dueDate: new Date().toISOString(),
      status: "Pending",
      description: "",
    });
    toast.success("Task added!");
  };

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const total = tasks.length;

  return (
    <div className="space-y-4 animate-fade-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-400" />
            Tasks
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{completed}/{total} completed</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="inp pl-9 text-sm"
            id="tasks-search"
          />
          {searchQuery && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon btn-ghost w-5 h-5">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                filter === key
                  ? "bg-brand-600/15 border border-brand-600/30 text-white"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              {label}
              {key === "overdue" && tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed").length > 0 && (
                <span className="ml-1 text-red-400">
                  {tasks.filter((t) => isOverdue(t.dueDate) && t.status !== "Completed").length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full gradient-brand rounded-full transition-all duration-700"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      )}

      {/* Task list */}
      <div className="card overflow-hidden">
        {/* Add task inline */}
        <AddTaskRow onAdd={handleAdd} />

        <div className="divide-y divide-[var(--border)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              type={searchQuery ? "search" : "tasks"}
              action={!searchQuery ? { label: "Add your first task", onClick: () => {} } : undefined}
            />
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="task-row flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-all duration-150 group cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggle(task._id); }}
                  className="flex-shrink-0 transition-transform hover:scale-110 active:scale-95"
                  aria-label={task.status === "Completed" ? "Mark incomplete" : "Mark complete"}
                >
                  {task.status === "Completed" ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <Circle size={18} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
                  )}
                </button>

                {/* Title */}
                <span className={`flex-1 text-sm truncate ${
                  task.status === "Completed" ? "line-through text-slate-500" : "text-slate-200"
                }`}>
                  {task.title}
                </span>

                {/* Actions - shown on hover */}
                <div className="task-actions flex items-center gap-1 ml-auto">
                  <span className={`text-2xs flex-shrink-0 ${
                    isOverdue(task.dueDate) && task.status !== "Completed" ? "text-red-400 font-medium" : "text-slate-500"
                  }`}>
                    {formatDateShort(task.dueDate)}
                  </span>
                  
                  <span className={`badge flex-shrink-0 ${
                    task.priority === "High" ? "badge-high" 
                    : task.priority === "Medium" ? "badge-medium" 
                    : "badge-low"
                  }`}>
                    <Flag size={9} />
                    {task.priority}
                  </span>

                  <button
                    onClick={(e) => { e.stopPropagation(); remove(task._id); toast.success("Deleted"); }}
                    className="btn-icon btn-ghost w-6 h-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300"
                    aria-label="Delete task"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={update}
          onDelete={remove}
        />
      )}
    </div>
  );
}
