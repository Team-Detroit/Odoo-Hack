import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Table } from '../types/table';

// Dedicated synchronous localStorage key (separate from Zustand persist)
export const TABLE_SESSION_KEY = 'odoo_cafe_table_session';

interface TableStore {
  selectedTable: Table | null;
  setSelectedTable: (table: Table | null) => void;
}

export const useTableStore = create<TableStore>()(
  persist(
    (set) => ({
      selectedTable: null,
      setSelectedTable: (table) => {
        // Write synchronously to localStorage immediately — bypasses Zustand async hydration
        if (table) {
          localStorage.setItem(TABLE_SESSION_KEY, table.id);
        } else {
          localStorage.removeItem(TABLE_SESSION_KEY);
        }
        set({ selectedTable: table });
      },
    }),
    {
      name: 'odoo_cafe_selected_table',
    }
  )
);

// Synchronous helper — reads the active table ID immediately without waiting for Zustand hydration
export const getActiveTableId = (): string | null => {
  try {
    return localStorage.getItem(TABLE_SESSION_KEY);
  } catch {
    return null;
  }
};
