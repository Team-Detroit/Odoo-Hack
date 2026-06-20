import React from 'react';
import { Button } from './Button';

interface DataTableProps<T extends Record<string, any>> {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }>;
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps<any>>(
  ({ columns, data, onEdit, onDelete, isLoading, emptyMessage = 'No data available' }, ref) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {emptyMessage}
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-2 text-left font-semibold text-gray-700"
                >
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-800">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 py-3 flex gap-2">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onDelete(item)}
                      >
                        Delete
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

DataTable.displayName = 'DataTable';
