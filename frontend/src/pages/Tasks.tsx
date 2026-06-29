import React, { useEffect, useState, useMemo } from "react";
import {
  Plus, Search, Filter, CheckSquare, Calendar, Flag, Trash2,
  ChevronDown, SortAsc, X, Circle, CheckCircle2, Edit3,
  AlarmClock, Tag, MoreHorizontal, Archive, AlignLeft
} from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import { useUIStore } from "../store/uiStore";
import { Task, Priority } from "../types";
import Drawer from "../components/shared/Drawer";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonRow } from "../components/ui/Skeleton";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
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
      <div slot="footer" className="flex items-center justify-between gap-2 flex-wrap pt-2">
        <button onClick={remove} className="btn-icon btn-ghost text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">
          <Trash2 size={16} /> 
        </button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</Button>
          <Button variant="primary" size="sm" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

function AddTaskRow({ onAdd }: { onAdd: (task: Partial<Task>) => Promise<void> }) {
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setShowAdvanced(false);
    setActive(false);
  };

  const submit = async () => {
    if (!title.trim()) return;
    await onAdd({ 
      title: title.trim(), 
      description: description.trim(), 
      priority, 
      dueDate: dueDate || new Date().toISOString() 
    });
    resetForm();
  };

  if (!active) {
    return (
      <button
        onClick={() => setActive(true)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 
                   dark:hover:bg-white/5 transition-all duration-200 text-sm group border-b border-[var(--border)]"
        id="tasks-add-new"
      >
        <Plus size={16} className="text-brand-500 dark:text-brand-400 transition-colors" />
        <span className="font-medium">Add task</span>
      </button>
    );
  }

  return (
    <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex flex-col gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name"
          className="bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full font-medium focus:ring-0 p-0"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
            if (e.key === "Escape") resetForm();
          }}
        />

        {showAdvanced && (
          <div className="flex flex-col gap-3 animate-fade-in mt-1">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-500 w-full resize-none min-h-[60px] focus:ring-0 p-0"
              onKeyDown={(e) => {
                if (e.key === "Escape") resetForm();
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className={`btn-ghost btn-sm text-xs flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors ${
                showAdvanced ? 'text-brand-400 bg-brand-500/10' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignLeft size={14} /> Description
            </button>
            <div className="flex items-center gap-1.5 bg-black/20 rounded-lg p-1 border border-white/5">
              <Flag size={14} className={
                priority === 'High' ? 'text-red-400' : 
                priority === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
              } />
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as Priority)} 
                className="bg-transparent border-none text-xs text-slate-600 dark:text-slate-300 outline-none focus:ring-0 py-0.5 pl-0 pr-6 cursor-pointer appearance-none"
              >
                <option value="High" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">High</option>
                <option value="Medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium</option>
                <option value="Low" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/5 px-2">
              <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                className="bg-transparent border-none text-xs text-slate-600 dark:text-slate-300 outline-none focus:ring-0 py-0.5 p-0 cursor-pointer" 
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-slate-400 hover:text-white">Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={!title.trim()}>Add Task</Button>
          </div>
        </div>
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

  const handleAdd = async (taskData: Partial<Task>) => {
    await create({
      title: taskData.title || "",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || new Date().toISOString(),
      status: "Pending",
      description: taskData.description || "",
    });
    toast.success("Task added!");
  };

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const total = tasks.length;

  return (
    <div className="space-y-4 animate-fade-in max-w-3xl">
      {/* Premium Header */}

      <div className="flex flex-col gap-6">

        <div className="flex items-start justify-between flex-wrap gap-4">

          <div>

            <p className="text-xs uppercase tracking-[0.25em] text-brand-500 font-semibold">
              Workspace
            </p>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-2">
              Tasks
            </h1>

            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
              Organize assignments, placement preparation,
              coding practice and personal goals from one place.
            </p>

          </div>

          <button
            id="new-task-btn"
            className="btn-brand px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            New Task
          </button>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 dark:!bg-slate-900/50 dark:!border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
              Total
            </p>
            <h2 className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
              {total}
            </h2>
          </Card>

          <Card className="p-4 dark:!bg-slate-900/50 dark:!border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
              Completed
            </p>
            <h2 className="text-2xl font-bold mt-2 text-emerald-500 dark:text-emerald-400">
              {completed}
            </h2>
          </Card>

          <Card className="p-4 dark:!bg-slate-900/50 dark:!border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
              Due Today
            </p>
            <h2 className="text-2xl font-bold mt-2 text-amber-500 dark:text-amber-400">
              {tasks.filter(t => isToday(parseISO(t.dueDate)) && t.status !== "Completed").length}
            </h2>
          </Card>

          <Card className="p-4 dark:!bg-slate-900/50 dark:!border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">
              High Priority
            </p>
            <h2 className="text-2xl font-bold mt-2 text-red-500 dark:text-red-400">
              {tasks.filter(t => t.priority === "High" && t.status !== "Completed").length}
            </h2>
          </Card>
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${filter === key
                  ? "bg-brand/10 border border-brand/20 text-brand-600 dark:bg-brand-600/15 dark:border-brand-600/30 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/5"
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
        <div className="h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-700"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      )}

      {/* Task list */}
      <Card className="p-0 overflow-hidden dark:!bg-slate-900/50 dark:!border-slate-800">
        {/* Add task inline */}
        <AddTaskRow onAdd={handleAdd} />

        <div className="divide-y divide-[var(--border)]">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filteredTasks.length === 0 ? (
            <EmptyState
              type={searchQuery ? "search" : "tasks"}
              action={!searchQuery ? { label: "Add your first task", onClick: () => { } } : undefined}
            />
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-all duration-150 group cursor-pointer border-b last:border-b-0 border-[var(--border)]"
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
                <span className={`flex-1 text-sm truncate transition-colors ${task.status === "Completed" ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-200"
                  }`}>
                  {task.title}
                </span>

                {/* Actions - shown on hover */}
                <div className="task-actions flex items-center gap-1 ml-auto">
                  <span className={`text-2xs flex-shrink-0 ${isOverdue(task.dueDate) && task.status !== "Completed" ? "text-red-400 font-medium" : "text-slate-500"
                    }`}>
                    {formatDateShort(task.dueDate)}
                  </span>

                  <span className={`badge flex-shrink-0 ${task.priority === "High" ? "badge-high"
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
      </Card>

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
