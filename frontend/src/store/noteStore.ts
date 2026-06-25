import { create } from "zustand";
import { api } from "../services/api";
import { Note } from "../types";

interface NoteState {
  notes: Note[];
  loading: boolean;
  activeNote: Note | null;
  searchQuery: string;
  activeCategory: string;
  
  fetch: () => Promise<void>;
  create: (payload: Partial<Note>) => Promise<Note>;
  update: (id: string, payload: Partial<Note>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setActive: (note: Note | null) => void;
  setSearch: (q: string) => void;
  setCategory: (cat: string) => void;
  togglePin: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  loading: false,
  activeNote: null,
  searchQuery: "",
  activeCategory: "all",

  fetch: async () => {
    set({ loading: true });
    try {
      const notes = await api.notes();
      set({ notes, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    const note = await api.createNote(payload);
    set((s) => ({ notes: [note, ...s.notes] }));
    return note;
  },

  update: async (id, payload) => {
    const updated = await api.updateNote(id, payload);
    set((s) => ({
      notes: s.notes.map((n) => (n._id === id ? updated : n)),
      activeNote: s.activeNote?._id === id ? updated : s.activeNote,
    }));
  },

  remove: async (id) => {
    await api.deleteNote(id);
    set((s) => ({
      notes: s.notes.filter((n) => n._id !== id),
      activeNote: s.activeNote?._id === id ? null : s.activeNote,
    }));
  },

  setActive: (note) => set({ activeNote: note }),
  setSearch: (searchQuery) => set({ searchQuery }),
  setCategory: (activeCategory) => set({ activeCategory }),

  togglePin: async (id) => {
    const note = get().notes.find((n) => n._id === id);
    if (!note) return;
    await get().update(id, { isPinned: !note.isPinned });
  },

  toggleFavorite: async (id) => {
    const note = get().notes.find((n) => n._id === id);
    if (!note) return;
    await get().update(id, { isFavorite: !note.isFavorite });
  },
}));
