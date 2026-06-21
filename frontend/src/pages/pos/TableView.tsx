import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { floorService } from '../../services/floorService';
import { tableService } from '../../services/tableService';
import { customerService } from '../../services/customerService';
import { useTableStore, getActiveTableId } from '../../store/tableStore';
import { useCartStore } from '../../store/cartStore';
import { CustomerAssignmentModal } from '../../components/pos/CustomerAssignmentModal';
import { Table } from '../../types/table';
import { ROUTES } from '../../constants/routes';
import { Spinner } from '../../components/common/Spinner';
import { Armchair } from 'lucide-react';

export const TableView: React.FC = () => {
  const qc = useQueryClient();
  const { data: floors = [], isLoading } = useQuery({ queryKey: ['floors'], queryFn: floorService.mockGetAll });
  const { selectedTable, setSelectedTable } = useTableStore();
  // Read synchronously from localStorage on first render — no async hydration wait
  const [sessionTableId] = useState<string | null>(() => getActiveTableId());
  const navigate = useNavigate();
  const [customerModal, setCustomerModal] = useState<{ open: boolean; table?: Table }>({ open: false });

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
              {Array.isArray(floor.tables) && [...floor.tables]
                .sort((a, b) => a.tableNumber - b.tableNumber)
                .map(t => {
                const isOccupied = t.status === 'OCCUPIED' || t.hasActiveOrder ||
                  (selectedTable?.id === t.id) || (sessionTableId === t.id);
                return (
                  <button 
                    key={t.id} 
                    onClick={async () => {
                      if (isOccupied) {
                        const confirmFree = window.confirm(`Table T${t.tableNumber} is currently occupied. Would you like to free it up and make it available?`);
                        if (confirmFree) {
                          try {
                            await tableService.updateStatus(t.id, 'AVAILABLE');
                            if (selectedTable?.id === t.id) {
                              setSelectedTable(null);
                            }
                            qc.invalidateQueries({ queryKey: ['floors'] });
                            alert(`Table T${t.tableNumber} is now available!`);
                          } catch (err: any) {
                            console.error("Failed to free table:", err);
                            alert("Failed to free table: " + err.message);
                          }
                        }
                        return;
                      }
                      setCustomerModal({ open: true, table: t });
                    }}
                    className={`group aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all hover:shadow-md ${isOccupied ? 'border-orange-400 bg-orange-50 cursor-pointer hover:bg-orange-100' : 'border-gray-200 bg-white hover:border-teal-400 hover:bg-teal-50'}`}
                  >
                    <Armchair className={`w-6 h-6 transition-colors ${isOccupied ? 'text-orange-500' : 'text-gray-400 group-hover:text-teal-500'}`} />
                    <span className="text-sm font-bold text-gray-800">T{t.tableNumber}</span>
                    <span className="text-xs text-gray-400">{t.numberOfSeats} seats</span>
                    {isOccupied && <span className="text-xs text-orange-500 font-bold">Occupied</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-4 mt-6">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-gray-200 bg-white" /><span className="text-xs text-gray-500">Available</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded border-2 border-orange-400 bg-orange-50" /><span className="text-xs text-gray-500">Occupied (Click to free)</span></div>
      </div>

      <CustomerAssignmentModal
        open={customerModal.open}
        onClose={() => setCustomerModal({ open: false })}
        tableNumber={customerModal.table?.tableNumber ?? 0}
        onAssign={async (name, email) => {
          const table = customerModal.table;
          if (!table) return;
          try {
            // 1. Create customer
            const customer = await customerService.create({ name, email });
            useCartStore.getState().setCustomer(customer.id);

            // 2. Mark table as OCCUPIED
            await tableService.updateStatus(table.id, 'OCCUPIED');
            qc.invalidateQueries({ queryKey: ['floors'] });

            selectTable(table);
          } catch (e: any) {
            console.error("Failed to assign table:", e);
            throw e;
          }
        }}
        onSkip={async () => {
          const table = customerModal.table;
          if (!table) return;
          try {
            useCartStore.getState().setCustomer('');

            // Mark table as OCCUPIED
            await tableService.updateStatus(table.id, 'OCCUPIED');
            qc.invalidateQueries({ queryKey: ['floors'] });

            selectTable(table);
          } catch (e: any) {
            console.error("Failed to skip and assign table:", e);
          }
        }}
      />
    </div>
  );
};
