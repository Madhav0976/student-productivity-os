import React, { useState } from "react";
import { X, CheckSquare, Target, BookOpen, Code2, Briefcase, FileText, Zap } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import { useTaskStore } from "../../store/taskStore";
import { useNoteStore } from "../../store/noteStore";
import { useGoalStore } from "../../store/goalStore";
import { useCodingStore } from "../../store/codingStore";
import { usePlacementStore } from "../../store/placementStore";
import { useStudyStore } from "../../store/studyStore";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import type { QuickCaptureType } from "../../types";
import toast from "react-hot-toast";

const TYPES: { key: QuickCaptureType; label: string; icon: React.ElementType; color: string }[] = [
  { key: "task", label: "Task", icon: CheckSquare, color: "text-blue-400" },
  { key: "goal", label: "Goal", icon: Target, color: "text-purple-400" },
  { key: "study", label: "Study", icon: BookOpen, color: "text-emerald-400" },
  { key: "coding", label: "Coding", icon: Code2, color: "text-amber-400" },
  { key: "placement", label: "Placement", icon: Briefcase, color: "text-pink-400" },
  { key: "note", label: "Note", icon: FileText, color: "text-slate-400" },
];

export default function QuickCapture() {
  const { quickCaptureOpen, closeQuickCapture } = useUIStore();
  const [activeType, setActiveType] = useState<QuickCaptureType>("task");
  const [title, setTitle] = useState("");
  const [extra, setExtra] = useState("");
  const [loading, setLoading] = useState(false);

  useKeyboardShortcut("q", () => {
    if (!quickCaptureOpen) useUIStore.getState().openQuickCapture();
  });

  useKeyboardShortcut(["ctrl+shift+n", "meta+shift+n"], () => {
    useUIStore.getState().openQuickCapture();
  });

  useKeyboardShortcut("escape", () => {
    if (quickCaptureOpen) closeQuickCapture();
  }, { preventDefault: false });

  const taskStore = useTaskStore();
  const noteStore = useNoteStore();
  const goalStore = useGoalStore();
  const codingStore = useCodingStore();
  const placementStore = usePlacementStore();
  const studyStore = useStudyStore();

  if (!quickCaptureOpen) return null;

  const reset = () => {
    setTitle("");
    setExtra("");
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      switch (activeType) {
        case "task":
          await taskStore.create({ title, priority: "Medium", dueDate: new Date().toISOString(), status: "Pending" });
          toast.success("Task created!");
          break;
        case "note":
          await noteStore.create({ title, content: extra || "", category: "Personal" });
          toast.success("Note created!");
          break;
        case "goal":
          await goalStore.create({ goalName: title, targetDate: new Date(Date.now() + 30*24*60*60*1000).toISOString(), progressPercentage: 0 });
          toast.success("Goal added!");
          break;
        case "coding":
          await codingStore.create({ title, platform: "LeetCode", difficulty: "Medium", topic: extra || "General", solvedDate: new Date().toISOString() });
          toast.success("Problem logged!");
          break;
        case "placement":
          await placementStore.create({ companyName: title, role: extra || "SWE", applicationDate: new Date().toISOString(), status: "Applied" });
          toast.success("Application added!");
          break;
        case "study":
          await studyStore.create({ subject: title, topic: extra || "General", duration: 60, completed: false, sessionDate: new Date().toISOString() });
          toast.success("Study session added!");
          break;
      }
      reset();
      closeQuickCapture();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const ActiveIcon = TYPES.find((t) => t.key === activeType)?.icon || Zap;

  return (
    <div className="modal-overlay" onClick={closeQuickCapture} role="dialog" aria-modal aria-label="Quick capture">
      <div className="w-full max-w-lg animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-0 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-brand-500" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">Quick Capture</span>
                <kbd className="text-2xs text-slate-500 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1.5">Q</kbd>
              </div>
              <button onClick={closeQuickCapture} className="btn-icon btn-ghost" aria-label="Close">
              <X size={16} />
            </button>
          </div>

          {/* Type selector */}
          <div className="flex gap-1 p-3 border-b border-[var(--border)]">
            {TYPES.map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setActiveType(key)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
                  ${activeType === key
                    ? "bg-brand/10 border border-brand/20 text-brand-600 dark:bg-brand-600/15 dark:border-brand-600/30 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-white/5"
                  }`}
              >
                <Icon size={12} className={activeType === key ? color : ""} />
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-2.5 text-brand-400">
                <ActiveIcon size={16} />
              </div>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  activeType === "task" ? "Task title..."
                  : activeType === "note" ? "Note title..."
                  : activeType === "goal" ? "What's your goal?"
                  : activeType === "coding" ? "Problem name..."
                  : activeType === "placement" ? "Company name..."
                  : "Study subject..."
                }
                className="inp flex-1 resize-none min-h-[44px] max-h-[120px] py-2"
                rows={1}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e as any); }
                }}
              />
            </div>

            {["coding", "placement", "study"].includes(activeType) && (
              <input
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder={
                  activeType === "coding" ? "Topic (e.g. Arrays, DP)..."
                  : activeType === "placement" ? "Role (e.g. SWE, Data)..."
                  : "Topic..."
                }
                className="inp"
              />
            )}

            <div className="flex items-center justify-between pt-1">
              <p className="text-2xs text-slate-500 dark:text-slate-600">
                Press <kbd className="text-2xs bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded px-1">↵</kbd> to save
              </p>
              <div className="flex items-center gap-2">
                <button type="button" onClick={closeQuickCapture} className="btn-secondary btn-sm">Cancel</button>
                <button
                  type="submit"
                  disabled={!title.trim() || loading}
                  className="btn-primary btn-sm"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
