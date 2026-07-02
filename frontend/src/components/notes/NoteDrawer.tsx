import React, { useState } from "react";
import Drawer from "../shared/Drawer";
import Button from "../ui/Button";
import { Note, NoteCategory } from "../../types";
import { Trash2, Pin } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES: NoteCategory[] = ["College", "Placement", "DSA", "Project", "Personal"];

interface NoteDrawerProps {
  note: Note;
  onClose: () => void;
  onUpdate: (id: string, payload: Partial<Note>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function NoteDrawer({ note, onClose, onUpdate, onDelete }: NoteDrawerProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [category, setCategory] = useState<NoteCategory>(note.category);
  const [tagsRaw, setTagsRaw] = useState((note.tags || []).join(", "));
  const [isPinned, setIsPinned] = useState(note.isPinned || false);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
      await onUpdate(note._id, { title, content, category, tags, isPinned });
      toast.success("Note saved");
      onClose();
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this note permanently?")) return;
    try {
      await onDelete(note._id);
      toast.success("Note deleted");
      onClose();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const footer = (
    <div className="flex items-center justify-between w-full">
      <button
        onClick={handleDelete}
        className="flex items-center justify-center w-9 h-9 rounded-xl text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
        title="Delete Note"
      >
        <Trash2 size={17} />
      </button>
      <div className="flex items-center gap-2.5">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 font-medium">Cancel</Button>
        <Button variant="primary" onClick={save} disabled={saving} className="bg-violet-600 hover:bg-violet-700 border-violet-600">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  return (
    <Drawer open onClose={onClose} title="Edit Note" footer={footer} width="max-w-lg">
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="inp font-medium text-base"
            placeholder="Note title"
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
        </div>

        {/* Category + Pinned row */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="inp text-sm"
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button
            onClick={() => setIsPinned(v => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors h-[42px] ${
              isPinned
                ? "bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-400"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-amber-300"
            }`}
          >
            <Pin size={15} /> {isPinned ? "Pinned" : "Pin"}
          </button>
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">Tags</label>
          <input
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="exam, important, review (comma separated)"
            className="inp text-sm"
          />
        </div>

        {/* Content */}
        <div>
          <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-1.5">
            Content <span className="normal-case font-normal text-slate-400">(Markdown supported)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="inp resize-none min-h-[220px] text-sm font-mono leading-relaxed"
            placeholder="Start writing... # Heading, **bold**, *italic*, - list"
            onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
          />
        </div>

        {/* Meta */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 px-4 py-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-700/60">
          <div className="flex justify-between text-slate-500">
            <span>Created</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(note.createdAt || note.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Last modified</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {new Date(note.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
