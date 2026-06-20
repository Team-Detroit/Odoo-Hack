import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { floorService } from '../../services/floorService';
import { useTableStore } from '../../store/tableStore';
import { Table } from '../../types/table';
import { ROUTES } from '../../constants/routes';
import { Spinner } from '../../components/common/Spinner';

export const TableView: React.FC = () => {
  const { data: floors = [], isLoading } = useQuery({ queryKey: ['floors'], queryFn: floorService.mockGetAll });
  const { setSelectedTable } = useTableStore();
  const navigate = useNavigate();

  const selectTable = (t: Table) => { setSelectedTable(t); navigate(ROUTES.POS); };

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Table View</h2>
      <div className="space-y-6">
        {Array.isArray(floors) && floors.map(floor => (
          <div key={floor.id}>
            <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">{floor.name}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
              {Array.isArray(floor.tables) && floor.tables.map(t => (
                <button key={t.id} onClick={() => selectTable(t)}
                  className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all hover:shadow-md ${t.hasActiveOrder ? 'border-orange-400 bg-orange-50 hover:bg-orange-100' : 'border-gray-200 bg-white hover:border-teal-400 hover:bg-teal-50'}`}>
                  <span className="text-lg">🪑</span>
                  <span className="text-sm font-bold text-gray-800">T{t.tableNumber}</span>
                  <span className="text-xs text-gray-400">{t.numberOfSeats} seats</span>
                  {t.hasActiveOrder && <span className="text-xs text-orange-500 font-medium">Active</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-6">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-gray-200 bg-white" /><span className="text-xs text-gray-500">Available</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-orange-400 bg-orange-50" /><span className="text-xs text-gray-500">Has Active Order</span></div>
      </div>
    </div>
  );
};
