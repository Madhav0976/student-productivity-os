import React, { useEffect, useState, useMemo } from "react";
import { useNoteStore } from "../store/noteStore";
import { Note, NoteCategory } from "../types";
import { formatRelative } from "../utils/dates";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

import NotesHeader from "../components/notes/NotesHeader";
import QuickNote from "../components/notes/QuickNote";
import NotesToolbar from "../components/notes/NotesToolbar";
import PinnedNotes from "../components/notes/PinnedNotes";
import RecentNotes from "../components/notes/RecentNotes";
import CategoriesGrid from "../components/notes/CategoriesGrid";
import NotesGrid from "../components/notes/NotesGrid";
import NoteDetail from "../components/notes/NoteDetail";
import NoteEditor from "../components/notes/NoteEditor";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/Skeleton";

export default function Notes() {
  const {
    notes, loading, fetch, create, update, remove,
    togglePin, toggleFavorite,
  } = useNoteStore();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Local filter state (not stored globally, just UI state)
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort] = useState("updated");
  const [pinnedOnly, setPinnedOnly] = useState(false);

  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    fetch();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "Escape") {
        if (isEditing) { setIsEditing(false); return; }
        if (selectedNote) { setSelectedNote(null); return; }
        if (quickAddOpen) { setQuickAddOpen(false); return; }
      }
      if (isInput) return;
      if (e.key === "n" || e.key === "N") { e.preventDefault(); setQuickAddOpen(true); }
      if (e.key === "/") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>("[data-search-input]")?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedNote, quickAddOpen]);

  // Derived state
  const pinnedNotes = useMemo(() => notes.filter(n => n.isPinned), [notes]);
  const recentNotes = useMemo(() =>
    [...notes]
      .filter(n => !n.isPinned)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5),
    [notes]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    notes.forEach(n => { counts[n.category] = (counts[n.category] || 0) + 1; });
    return counts;
  }, [notes]);

  const lastEdited = useMemo(() => {
    if (!notes.length) return null;
    const sorted = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return formatRelative(sorted[0].updatedAt);
  }, [notes]);

  // Filtered + sorted notes
  const filteredNotes = useMemo(() => {
    let result = notes;

    if (pinnedOnly) result = result.filter(n => n.isPinned);
    if (activeCategory !== "all") result = result.filter(n => n.category === activeCategory);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q) ||
        n.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return new Date(b.createdAt || b.updatedAt).getTime() - new Date(a.createdAt || a.updatedAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, pinnedOnly, activeCategory, debouncedSearch, sort]);

  const isFiltered = !!debouncedSearch || activeCategory !== "all" || pinnedOnly;

  const handleAdd = async (payload: Partial<Note>) => {
    try {
      await create({ ...payload, category: payload.category || "Personal" });
      toast.success("Note created!");
    } catch {
      toast.error("Failed to create note");
    }
  };

  if (selectedNote) {
    if (isEditing) {
      return (
        <NoteEditor
          note={selectedNote}
          onCancel={() => setIsEditing(false)}
          onSave={update}
        />
      );
    }
    return (
      <NoteDetail
        note={selectedNote}
        onBack={() => { setSelectedNote(null); setIsEditing(false); }}
        onEdit={() => setIsEditing(true)}
        onDelete={async (id) => { await remove(id); setSelectedNote(null); }}
        onTogglePin={togglePin}
        onToggleFav={toggleFavorite}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl pb-24">
      {/* Header */}
      <NotesHeader
        totalNotes={notes.length}
        pinnedCount={pinnedNotes.length}
        categoriesCount={Object.keys(categoryCounts).length}
        lastEdited={lastEdited}
        onNewNote={() => setQuickAddOpen(true)}
      />

      {/* Quick Add card */}
      <div className="card p-0 overflow-hidden shadow-sm dark:!bg-slate-900/50 dark:!border-slate-800">
        <QuickNote
          isExpanded={quickAddOpen}
          onExpand={() => setQuickAddOpen(true)}
          onCollapse={() => setQuickAddOpen(false)}
          onAdd={handleAdd}
        />
      </div>

      {/* Toolbar */}
      <NotesToolbar
        search={search}
        onSearch={setSearch}
        activeCategory={activeCategory}
        onCategory={setActiveCategory}
        sort={sort}
        onSort={setSort}
        pinnedOnly={pinnedOnly}
        onPinnedOnly={setPinnedOnly}
        count={filteredNotes.length}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : notes.length === 0 ? (
        <EmptyState
          type="notes"
          action={{ label: "Create your first note", onClick: () => setQuickAddOpen(true) }}
        />
      ) : (
        <div className="space-y-10">
          {/* Pinned (only when not filtered) */}
          {!isFiltered && pinnedNotes.length > 0 && (
            <PinnedNotes
              notes={pinnedNotes}
              onClick={setSelectedNote}
              onUnpin={(id) => togglePin(id)}
            />
          )}

          {/* Recent (only on unfiltered "all" view) */}
          {!isFiltered && recentNotes.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                Recently Edited
              </h2>
              <RecentNotes notes={recentNotes} onClick={setSelectedNote} />
            </div>
          )}

          {/* Categories (only on unfiltered view) */}
          {!isFiltered && (
            <CategoriesGrid
              categoryCounts={categoryCounts}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          )}

          {/* All / Filtered Notes */}
          <div>
            {isFiltered && (
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                {filteredNotes.length} Result{filteredNotes.length !== 1 ? "s" : ""}
              </h2>
            )}
            {!isFiltered && (
              <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                All Notes
              </h2>
            )}

            {filteredNotes.length === 0 ? (
              <EmptyState
                type={debouncedSearch ? "search" : "notes"}
                title={debouncedSearch ? `No results for "${debouncedSearch}"` : undefined}
                action={
                  !debouncedSearch
                    ? { label: "Create a note", onClick: () => setQuickAddOpen(true) }
                    : undefined
                }
              />
            ) : (
              <NotesGrid
                notes={filteredNotes}
                onClick={setSelectedNote}
                onTogglePin={togglePin}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
