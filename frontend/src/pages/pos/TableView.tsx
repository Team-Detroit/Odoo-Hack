import React, { useState } from 'react';
import { Button } from '../../components/common/Button';

export const TableView: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [floors] = useState<any[]>([
    {
      id: '1',
      name: 'Ground Floor',
      tables: [
        { id: 't1', number: 1, seats: 4, hasOrder: false },
        { id: 't2', number: 2, seats: 2, hasOrder: true },
        { id: 't3', number: 3, seats: 6, hasOrder: false },
      ],
    },
  ]);

  const currentFloor = selectedFloor ? floors.find((f) => f.id === selectedFloor) : floors[0];

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-bold mb-6">Table Management</h1>

      {/* Floor Selector */}
      <div className="flex gap-2 mb-6">
        {floors.map((floor) => (
          <Button
            key={floor.id}
            onClick={() => setSelectedFloor(floor.id)}
            variant={selectedFloor === floor.id ? 'primary' : 'secondary'}
          >
            {floor.name}
          </Button>
        ))}
      </div>

      {/* Table Grid */}
      {currentFloor && (
        <div className="grid grid-cols-4 gap-4">
          {currentFloor.tables.map((table: any) => (
            <div
              key={table.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                table.hasOrder
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-white hover:border-teal-500'
              }`}
            >
              <div className="text-2xl font-bold mb-2">Table {table.number}</div>
              <div className="text-sm text-gray-600 mb-4">{table.seats} Seats</div>
              {table.hasOrder && (
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                  Active Order
                </span>
              )}
              <Button size="sm" className="w-full mt-3">
                {table.hasOrder ? 'View Order' : 'New Order'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
