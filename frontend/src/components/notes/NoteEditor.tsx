import React, { useState } from "react";
import { Note, NoteCategory } from "../../types";
import { ArrowLeft, Save, X } from "lucide-react";
import Button from "../ui/Button";
import toast from "react-hot-toast";

const CATEGORIES: NoteCategory[] = ["College", "Placement", "DSA", "Project", "Personal"];

interface NoteEditorProps {
  note: Note;
  onCancel: () => void;
  onSave: (id: string, payload: Partial<Note>) => Promise<void>;
}

export default function NoteEditor({ note, onCancel, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || "");
  const [category, setCategory] = useState<NoteCategory>(note.category);
  const [tagsRaw, setTagsRaw] = useState((note.tags || []).join(", "));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const tags = tagsRaw.split(",").map(t => t.trim()).filter(Boolean);
      await onSave(note._id, { title, content, category, tags });
      toast.success("Note saved");
      onCancel();
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24 h-screen flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 py-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={18} /> Cancel Editing
        </button>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={handleSave} disabled={saving} className="gap-2 bg-violet-600 hover:bg-violet-700 border-violet-600">
            <Save size={16} /> {saving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-4xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="Note Title"
          />
        </div>
        
        <div className="flex items-center gap-4 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as NoteCategory)}
            className="inp text-sm max-w-[200px]"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            value={tagsRaw}
            onChange={(e) => setTagsRaw(e.target.value)}
            placeholder="Tags (comma separated)"
            className="inp text-sm flex-1 max-w-[400px]"
          />
        </div>

        <div className="flex-1 min-h-[500px]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none text-lg text-slate-700 dark:text-slate-300 resize-none font-sans leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-700"
            placeholder="Start writing... Markdown is supported."
          />
        </div>
      </div>
    </div>
  );
}
