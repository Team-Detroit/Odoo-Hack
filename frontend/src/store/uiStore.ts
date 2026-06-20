import { create } from 'zustand';

interface UiStore {
  activeModal: string | null;
  openModal: (name: string) => void;
  closeModal: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeModal: null,
  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
