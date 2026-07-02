import React, { useState } from "react";
import Drawer from "../shared/Drawer";
import Button from "../ui/Button";
import { Task, Priority } from "../../types";
import { Trash2, CheckCircle2, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

interface TaskDrawerProps {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskDrawer({ task, onClose, onUpdate, onDelete }: TaskDrawerProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate?.split("T")[0] || "");
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const isCompleted = status === "Completed";

  const save = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await onUpdate(task._id, { title: title.trim(), description, priority, dueDate, status });
      toast.success("Task updated");
      onClose();
    } catch {
      toast.error("Failed to update");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this task permanently?")) return;
    try {
      await onDelete(task._id);
      toast.success("Task deleted");
      onClose();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleToggleComplete = async () => {
    const newStatus = isCompleted ? "Pending" : "Completed";
    setStatus(newStatus);
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        title="Delete Task"
      >
        <Trash2 size={17} />
      </button>
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 font-medium">
          Cancel
        </Button>
        <Button variant="primary" onClick={save} disabled={saving} className="font-semibold shadow-md">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer open onClose={onClose} title="Task Details" footer={footer}>
      <div className="space-y-5">
        {/* Complete/Restore toggle */}
        <button
          onClick={handleToggleComplete}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
            isCompleted
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-600/40 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:border-emerald-600/40 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Completed — click to restore</span>
              <RotateCcw size={14} className="ml-auto opacity-60" />
            </>
          ) : (
            <>
              <CheckCircle2 size={18} className="text-slate-400" />
              <span>Mark as complete</span>
            </>
          )}
        </button>

        {/* Title */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="inp text-base font-medium"
            placeholder="Task title"
            onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onClose(); }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="inp resize-none min-h-[100px] text-sm leading-relaxed"
            placeholder="Add detailed notes, requirements, or context..."
            rows={4}
          />
        </div>

        {/* Priority + Status row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="inp text-sm font-medium"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="inp text-sm font-medium"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="inp text-sm"
          />
        </div>

        {/* Meta */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-700/60">
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Created</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(task.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </div>
          <div className="flex justify-between text-slate-500 dark:text-slate-400">
            <span>Last modified</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(task.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
