import { create } from "zustand";

interface StoreState {
  tags: string[];
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  editTag: (tag: string, newName: string) => void;
}

const useStore = create<StoreState>((set) => ({
  tags: ["NICE", "DEVELOPER", "REACT"],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
  editTag: (tag, newName) =>
    set((state) => ({
      tags: state.tags.map((t) => (t === tag ? newName : t)),
    })),
}));

export default useStore;
