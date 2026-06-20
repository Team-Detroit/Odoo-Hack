import React from 'react';
import { Spinner } from './Spinner';
import { EmptyState } from './EmptyState';

interface Column<T> { key: string; header: string; render?: (row: T) => React.ReactNode; width?: string; }
interface DataTableProps<T> { columns: Column<T>[]; data: T[]; loading?: boolean; keyField?: string; }

export function DataTable<T extends Record<string, unknown>>({ columns, data, loading, keyField = 'id' }: DataTableProps<T>) {
  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!data.length) return <EmptyState title="No records found" />;
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide" style={c.width ? { width: c.width } : {}}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((row, i) => (
            <tr key={String(row[keyField] ?? i)} className="hover:bg-gray-50 transition-colors">
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-gray-700">
                  {c.render ? c.render(row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
