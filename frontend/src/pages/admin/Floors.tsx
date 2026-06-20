import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { floorService } from '../../services/floorService';
import { tableService } from '../../services/tableService';
import { Floor } from '../../types/floor';
import { Table } from '../../types/table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Spinner } from '../../components/common/Spinner';
import { Toggle } from '../../components/common/Toggle';

const FloorFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Floor }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [name, setName] = useState(initial?.name ?? '');
  React.useEffect(() => setName(initial?.name ?? ''), [initial, open]);
  const save = useMutation({
    mutationFn: () => initial ? floorService.update(initial.id, { name }) : floorService.create({ name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); onClose(); },
  });
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Floor' : 'New Floor'} size="sm">
      <Input label="Floor Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ground Floor" />
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

const TableFormModal: React.FC<{ open: boolean; onClose: () => void; floorId: string; initial?: Table }> = ({ open, onClose, floorId, initial }) => {
  const qc = useQueryClient();
  const [tableNumber, setTableNumber] = useState(initial?.tableNumber ?? 1);
  const [seats, setSeats] = useState(initial?.numberOfSeats ?? 2);
  React.useEffect(() => { setTableNumber(initial?.tableNumber ?? 1); setSeats(initial?.numberOfSeats ?? 2); }, [initial, open]);
  const save = useMutation({
    mutationFn: () => initial
      ? tableService.update(initial.id, { tableNumber, numberOfSeats: seats })
      : tableService.create({ floorId, tableNumber, numberOfSeats: seats }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); onClose(); },
  });
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Table' : 'Add Table'} size="sm">
      <div className="space-y-3">
        <Input label="Table Number" type="number" value={tableNumber} onChange={e => setTableNumber(Number(e.target.value))} />
        <Input label="Number of Seats" type="number" value={seats} onChange={e => setSeats(Number(e.target.value))} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

export const Floors: React.FC = () => {
  const qc = useQueryClient();
  const { data: floors = [], isLoading } = useQuery({ queryKey: ['floors'], queryFn: floorService.mockGetAll });
  const [floorForm, setFloorForm] = useState(false);
  const [editFloor, setEditFloor] = useState<Floor | undefined>();
  const [tableForm, setTableForm] = useState<{ open: boolean; floorId: string; table?: Table }>({ open: false, floorId: '' });
  const [delFloor, setDelFloor] = useState<Floor | undefined>();
  const [delTable, setDelTable] = useState<Table | undefined>();

  const removeFloor = useMutation({ mutationFn: (id: string) => floorService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); setDelFloor(undefined); } });
  const removeTable = useMutation({ mutationFn: (id: string) => tableService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); setDelTable(undefined); } });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Floors & Tables</h2>
        <Button onClick={() => { setEditFloor(undefined); setFloorForm(true); }}>+ New Floor</Button>
      </div>

      <div className="space-y-6">
        {floors.map(floor => (
          <div key={floor.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-700">{floor.name}</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { setEditFloor(floor); setFloorForm(true); }}>Edit</Button>
                <Button size="sm" onClick={() => setTableForm({ open: true, floorId: floor.id })}>+ Table</Button>
                <Button size="sm" variant="danger" onClick={() => setDelFloor(floor)}>Delete</Button>
              </div>
            </div>
            <div className="p-4">
              {floor.tables.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No tables yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {floor.tables.map(t => (
                    <div key={t.id} className={`border-2 rounded-lg p-3 text-center ${t.hasActiveOrder ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                      <p className="font-bold text-gray-800">T{t.tableNumber}</p>
                      <p className="text-xs text-gray-400">{t.numberOfSeats} seats</p>
                      <div className="flex gap-1 mt-2 justify-center">
                        <button onClick={() => setTableForm({ open: true, floorId: floor.id, table: t })} className="text-xs text-teal-600 hover:underline">Edit</button>
                        <span className="text-gray-300">|</span>
                        <button onClick={() => setDelTable(t)} className="text-xs text-red-500 hover:underline">Del</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <FloorFormModal open={floorForm} onClose={() => setFloorForm(false)} initial={editFloor} />
      <TableFormModal open={tableForm.open} onClose={() => setTableForm({ open: false, floorId: '' })} floorId={tableForm.floorId} initial={tableForm.table} />
      <ConfirmDeleteModal open={!!delFloor} onClose={() => setDelFloor(undefined)} onConfirm={() => delFloor && removeFloor.mutate(delFloor.id)} loading={removeFloor.isPending} message={`Delete floor "${delFloor?.name}"?`} />
      <ConfirmDeleteModal open={!!delTable} onClose={() => setDelTable(undefined)} onConfirm={() => delTable && removeTable.mutate(delTable.id)} loading={removeTable.isPending} message={`Delete Table ${delTable?.tableNumber}?`} />
    </div>
  );
};
