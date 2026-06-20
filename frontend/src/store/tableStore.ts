import { create } from 'zustand';
import { Table } from '../types/table';

interface TableStore {
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
}

export const useTableStore = create<TableStore>((set) => ({
  selectedTable: null,
  setSelectedTable: (table) => set({ selectedTable: table }),
}));
