import { create } from "zustand";
import { api } from "../services/api";
import { Placement } from "../types";

interface PlacementState {
  placements: Placement[];
  loading: boolean;
  selectedPlacement: Placement | null;
  
  fetch: () => Promise<void>;
  create: (payload: Partial<Placement>) => Promise<Placement>;
  update: (id: string, payload: Partial<Placement>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setSelected: (p: Placement | null) => void;
  moveStage: (id: string, status: Placement["status"]) => Promise<void>;
}

export const usePlacementStore = create<PlacementState>((set, get) => ({
  placements: [],
  loading: false,
  selectedPlacement: null,

  fetch: async () => {
    set({ loading: true });
    try {
      const placements = await api.placements();
      set({ placements, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  create: async (payload) => {
    const placement = await api.createPlacement(payload);
    set((s) => ({ placements: [placement, ...s.placements] }));
    return placement;
  },

  update: async (id, payload) => {
    const updated = await api.updatePlacement(id, payload);
    set((s) => ({
      placements: s.placements.map((p) => (p._id === id ? updated : p)),
      selectedPlacement: s.selectedPlacement?._id === id ? updated : s.selectedPlacement,
    }));
  },

  remove: async (id) => {
    set((s) => ({ placements: s.placements.filter((p) => p._id !== id) }));
  },

  setSelected: (p) => set({ selectedPlacement: p }),

  moveStage: async (id, status) => {
    await get().update(id, { status });
  },
}));
