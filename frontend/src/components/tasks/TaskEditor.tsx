import React, { useState } from "react";
import { Task, Priority } from "../../types";
import { X, Save } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

interface TaskEditorProps {
  task: Task;
  onCancel: () => void;
  onSave: (id: string, payload: Partial<Task>) => Promise<void>;
}

export default function TaskEditor({ task, onCancel, onSave }: TaskEditorProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate?.split("T")[0] || "");
  const [status, setStatus] = useState(task.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      await onSave(task._id, { title: title.trim(), description, priority, dueDate, status });
      toast.success("Task saved");
      onCancel();
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={18} /> Cancel Editing
        </button>
        <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2 bg-blue-600 hover:bg-blue-700 border-blue-600">
          <Save size={16} /> {saving ? "Saving..." : "Save Task"}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-sm space-y-6">
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-slate-200 dark:border-slate-800 outline-none text-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 pb-2 focus:border-blue-500 transition-colors"
            placeholder="Task Title"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="inp text-sm font-medium w-full"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="inp text-sm font-medium w-full"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="inp text-sm w-full"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg outline-none text-base text-slate-700 dark:text-slate-300 resize-y min-h-[300px] p-4 font-sans leading-relaxed placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            placeholder="Add detailed notes, requirements, or context..."
          />
        </div>
      </div>
    </div>
  );
}
