import React, { useEffect, useState, useMemo } from "react";
import { FileText, Plus, Search, Pin, Star, X, Hash, ChevronRight, Trash2, Save } from "lucide-react";
import { useNoteStore } from "../store/noteStore";
import { Note, NoteCategory } from "../types";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/Skeleton";
import { formatRelative } from "../utils/dates";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

const CATEGORIES: { key: string; label: string; color: string }[] = [
  { key: "all", label: "All Notes", color: "text-slate-400" },
  { key: "College", label: "College", color: "text-blue-400" },
  { key: "Placement", label: "Placement", color: "text-pink-400" },
  { key: "DSA", label: "DSA", color: "text-amber-400" },
  { key: "Project", label: "Project", color: "text-emerald-400" },
  { key: "Personal", label: "Personal", color: "text-purple-400" },
];

function NoteEditor({ note, onClose, onSave, onDelete }: {
  note: Note | null;
  onClose: () => void;
  onSave: (payload: Partial<Note>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [category, setCategory] = useState<NoteCategory>(note?.category || "Personal");
  const [saving, setSaving] = useState(false);

  // Auto-save
  const save = async (silent = false) => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSave({ title, content, category });
      if (!silent) toast.success(note ? "Note saved!" : "Note created!");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  // Ctrl+S save
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        save(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [title, content, category]);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Editor toolbar */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border)]">
        <select value={category} onChange={(e) => setCategory(e.target.value as NoteCategory)} className="inp !py-1 text-xs w-auto">
          {CATEGORIES.slice(1).map((c) => <option key={c.key}>{c.key}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-2xs text-slate-600">{saving ? "Saving..." : "⌘S to save"}</span>
        {onDelete && note && (
          <button
            onClick={async () => { if (confirm("Delete this note?")) { await onDelete(note._id); onClose(); } }}
            className="btn-icon btn-ghost text-red-400"
          >
            <Trash2 size={13} />
          </button>
        )}
        <button onClick={() => save()} className="btn-brand btn-sm">
          <Save size={12} /> Save
        </button>
        <button onClick={onClose} className="btn-icon btn-ghost">
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 px-8 py-6 overflow-y-auto">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="bg-transparent border-none outline-none text-2xl font-bold text-white w-full mb-4 placeholder:text-slate-700"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing... (Markdown supported)"
          className="note-editor w-full"
          rows={20}
        />
        <div className="text-2xs text-slate-700 mt-4">
          Supports **bold**, *italic*, # headings, `code`, - lists
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const { notes, loading, fetch, create, update, remove, activeNote, setActive, searchQuery, setSearch, activeCategory, setCategory } = useNoteStore();
  const [creating, setCreating] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 250);

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    let result = notes;
    if (activeCategory !== "all") result = result.filter((n) => n.category === activeCategory);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
    }
    const pinned = result.filter((n) => n.isPinned);
    const rest = result.filter((n) => !n.isPinned);
    return [...pinned, ...rest];
  }, [notes, activeCategory, debouncedSearch]);

  const openNote = (note: Note) => { setCreating(false); setActive(note); };

  const handleSave = async (payload: Partial<Note>) => {
    if (activeNote) {
      await update(activeNote._id, payload);
    } else {
      const note = await create({ ...payload, category: payload.category || "Personal" });
      setActive(note);
    }
    setCreating(false);
  };

  const handleNew = () => {
    setActive(null);
    setCreating(true);
  };

  // Editor mode
  if (activeNote || creating) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col card overflow-hidden">
        <NoteEditor
          note={activeNote}
          onClose={() => { setActive(null); setCreating(false); }}
          onSave={handleSave}
          onDelete={remove}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-slate-300" />
            Notes
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={handleNew} className="btn-brand btn-sm" id="notes-new">
          <Plus size={14} /> New Note
        </button>
      </div>

      <div className="flex gap-4 flex-col sm:flex-row">
        {/* Category sidebar */}
        <div className="sm:w-44 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {CATEGORIES.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                  activeCategory === key
                    ? "bg-brand-600/15 border border-brand-600/20 text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                <Hash size={12} className={color} />
                <span className="truncate">{label}</span>
                <span className="ml-auto text-2xs text-slate-600">
                  {key === "all" ? notes.length : notes.filter((n) => n.category === key).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes list */}
        <div className="flex-1 min-w-0">
          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="inp pl-9 text-sm"
              id="notes-search"
            />
          </div>

          {loading ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : filtered.length === 0 ? (
            <EmptyState
              type="notes"
              action={{ label: "Create your first note", onClick: handleNew }}
            />
          ) : (
            <div className="space-y-1">
              {/* Pinned section */}
              {filtered.some((n) => n.isPinned) && (
                <>
                  <p className="section-title px-1 pb-1">Pinned</p>
                  {filtered.filter((n) => n.isPinned).map((note) => (
                    <NoteRow key={note._id} note={note} onClick={openNote} onTogglePin={(id) => useNoteStore.getState().togglePin(id)} onToggleFav={(id) => useNoteStore.getState().toggleFavorite(id)} />
                  ))}
                  <p className="section-title px-1 pb-1 pt-3">Other</p>
                </>
              )}
              {filtered.filter((n) => !n.isPinned).map((note) => (
                <NoteRow key={note._id} note={note} onClick={openNote} onTogglePin={(id) => useNoteStore.getState().togglePin(id)} onToggleFav={(id) => useNoteStore.getState().toggleFavorite(id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NoteRow({ note, onClick, onTogglePin, onToggleFav }: {
  note: Note;
  onClick: (n: Note) => void;
  onTogglePin: (id: string) => void;
  onToggleFav: (id: string) => void;
}) {
  const catColor = CATEGORIES.find((c) => c.key === note.category)?.color || "text-slate-400";
  return (
    <div
      onClick={() => onClick(note)}
      className="card flex items-center gap-3 px-4 py-3 cursor-pointer hover:border-brand-600/20 hover:bg-brand-600/5 transition-all duration-150 group"
    >
      <FileText size={15} className={catColor + " flex-shrink-0"} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate transition-colors">{note.title}</p>
        <p className="text-2xs text-slate-600 mt-0.5 line-clamp-1">{note.content?.slice(0, 80) || "Empty"}</p>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(note._id); }}
          className={`btn-icon btn-ghost w-6 h-6 ${note.isPinned ? "text-brand-400" : "text-slate-600"}`}
        >
          <Pin size={11} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(note._id); }}
          className={`btn-icon btn-ghost w-6 h-6 ${note.isFavorite ? "text-amber-400" : "text-slate-600"}`}
        >
          <Star size={11} />
        </button>
      </div>
      <span className="text-2xs text-slate-600 ml-2 flex-shrink-0">{formatRelative(note.updatedAt)}</span>
      <ChevronRight size={13} className="text-slate-700 group-hover:text-slate-500 flex-shrink-0" />
    </div>
  );
}
