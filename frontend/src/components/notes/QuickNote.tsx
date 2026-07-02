import React, { useState, useRef, useEffect } from "react";
import { Plus, Hash, AlignLeft } from "lucide-react";
import Button from "../ui/Button";
import { Note, NoteCategory } from "../../types";

interface QuickNoteProps {
  isExpanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onAdd: (note: Partial<Note>) => Promise<any>;
}

const CATEGORIES: NoteCategory[] = ["College", "Placement", "DSA", "Project", "Personal"];
const today = () => new Date().toISOString().slice(0, 10);

export default function QuickNote({ isExpanded, onExpand, onCollapse, onAdd }: QuickNoteProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<NoteCategory>("Personal");
  const [tags, setTags] = useState("");
  const [showContent, setShowContent] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) titleRef.current?.focus();
  }, [isExpanded]);

  const reset = () => {
    setTitle(""); setContent(""); setCategory("Personal"); setTags(""); setShowContent(false);
    onCollapse();
  };

  const submit = async () => {
    if (!title.trim()) return;
    const tagArr = tags.split(",").map(t => t.trim()).filter(Boolean);
    await onAdd({ title: title.trim(), content: content.trim(), category, tags: tagArr });
    reset();
  };

  if (!isExpanded) {
    return (
      <button
        onClick={onExpand}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/5 transition-all duration-200 text-sm group border-b border-[var(--border)]"
      >
        <Plus size={16} className="text-violet-500 dark:text-violet-400 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Capture a quick note</span>
        <span className="ml-auto text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-sans">N</kbd>
        </span>
      </button>
    );
  }

  return (
    <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/40 animate-fade-in">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="inp text-sm font-medium col-span-2"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(); if (e.key === "Escape") reset(); }}
          />
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-800">
            <Hash size={13} className="text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 outline-none font-medium w-full cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {showContent && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note... (Markdown supported)"
            className="inp resize-none min-h-[80px] text-sm font-mono leading-relaxed"
            onKeyDown={(e) => { if (e.key === "Escape") reset(); }}
          />
        )}

        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated, e.g. exam, important)"
          className="inp text-sm text-slate-500"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") reset(); }}
        />

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setShowContent((v) => !v)}
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1.5 rounded-lg transition-colors ${
              showContent ? "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <AlignLeft size={13} /> {showContent ? "Hide" : "Add"} Content
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={reset} className="text-slate-500">Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit} disabled={!title.trim()} className="bg-violet-600 hover:bg-violet-700 border-violet-600">
              Save Note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
