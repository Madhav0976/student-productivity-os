import React, { useState, useRef, useEffect } from "react";
import { Plus, AlignLeft, Flag, Calendar } from "lucide-react";
import Button from "../ui/Button";
import { Priority, Task } from "../../types";

interface TaskQuickAddProps {
  onAdd: (task: Partial<Task>) => Promise<void>;
  isExpanded: boolean;
  onCollapse: () => void;
  onExpand: () => void;
}

export default function TaskQuickAdd({ onAdd, isExpanded, onCollapse, onExpand }: TaskQuickAddProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setShowAdvanced(false);
    onCollapse();
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

  if (!isExpanded) {
    return (
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 
                   dark:hover:bg-white/5 transition-all duration-200 text-sm group border-b border-[var(--border)]"
      >
        <Plus size={16} className="text-brand-500 dark:text-brand-400 transition-colors group-hover:scale-110" />
        <span className="font-medium">Add task</span>
        <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-sans">Q</kbd> to quick add
        </span>
      </button>
    );
  }

  return (
    <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="bg-transparent border-none outline-none text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full font-medium focus:ring-0 p-0"
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
              placeholder="Description (optional)"
              className="bg-transparent border-none outline-none text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-full resize-none min-h-[60px] focus:ring-0 p-0"
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
                showAdvanced ? 'text-brand-600 bg-brand-500/10 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <AlignLeft size={14} /> Description
            </button>

            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/5 transition-colors focus-within:border-brand-500/50">
              <Flag size={14} className={
                priority === 'High' ? 'text-red-500 dark:text-red-400' :
                priority === 'Medium' ? 'text-amber-500 dark:text-amber-400' : 'text-emerald-500 dark:text-emerald-400'
              } />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none focus:ring-0 py-0.5 pl-0 pr-6 cursor-pointer appearance-none font-medium"
              >
                <option value="High" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">High Priority</option>
                <option value="Medium" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Medium Priority</option>
                <option value="Low" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Low Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-black/20 rounded-lg p-1 border border-slate-200 dark:border-white/5 px-2 transition-colors focus-within:border-brand-500/50">
              <Calendar size={14} className="text-slate-500 dark:text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none focus:ring-0 py-0.5 p-0 cursor-pointer font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={resetForm} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={!title.trim()}>
              Save Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
