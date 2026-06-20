import React, { useState, useEffect, useRef } from 'react';
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
import { Move, Maximize2, Trash2, Edit2, Plus, Check, Settings, Layout, Info } from 'lucide-react';

const FloorFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Floor }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [name, setName] = useState(initial?.name ?? '');
  useEffect(() => setName(initial?.name ?? ''), [initial, open]);
  const save = useMutation({
    mutationFn: () => initial ? floorService.update(initial.id, { name }) : floorService.create({ name }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['floors'] }); onClose(); },
  });
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Floor' : 'New Floor'} size="sm">
      <Input label="Floor Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Main Hall" />
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

const TableFormModal: React.FC<{ open: boolean; onClose: () => void; floorId: string; initial?: Table; onSaveLocal: (table: Table) => void }> = ({ open, onClose, floorId, initial, onSaveLocal }) => {
  const [tableNumber, setTableNumber] = useState(initial?.tableNumber ?? 1);
  const [seats, setSeats] = useState(initial?.numberOfSeats ?? 2);
  const [shape, setShape] = useState<'square' | 'rectangle' | 'round'>(initial?.shape ?? 'square');
  const [isOos, setIsOos] = useState(initial?.isOutOfService ?? false);

  useEffect(() => {
    if (initial) {
      setTableNumber(initial.tableNumber);
      setSeats(initial.numberOfSeats);
      setShape(initial.shape ?? 'square');
      setIsOos(initial.isOutOfService ?? false);
    }
  }, [initial, open]);

  const handleSave = () => {
    const updatedTable: Table = {
      ...(initial || {
        id: `t_${Date.now()}`,
        floorId,
        isActive: true,
        hasActiveOrder: false,
        x: 40,
        y: 40,
        width: shape === 'rectangle' ? 16 : 10,
        height: 14,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      tableNumber,
      numberOfSeats: seats,
      shape,
      isOutOfService: isOos,
    };
    onSaveLocal(updatedTable);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Table Properties' : 'Add Table'} size="sm">
      <div className="space-y-4">
        <Input label="Table Number" type="number" value={tableNumber} onChange={e => setTableNumber(Number(e.target.value))} />
        <Input label="Number of Seats" type="number" value={seats} onChange={e => setSeats(Number(e.target.value))} />
        
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shape</label>
          <div className="grid grid-cols-3 gap-2">
            {(['square', 'rectangle', 'round'] as const).map(s => (
              <button
                key={s}
                onClick={() => setShape(s)}
                className={`py-2 px-3 border rounded-lg text-sm font-medium capitalize transition-all ${shape === s ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold shadow-sm' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="oos-checkbox"
            checked={isOos}
            onChange={e => setIsOos(e.target.checked)}
            className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
          />
          <label htmlFor="oos-checkbox" className="text-sm font-medium text-gray-700 select-none">
            Out of Service (OOS Closed)
          </label>
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-6">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </Modal>
  );
};

// Component to render chairs around a table based on position and capacity
const TableChairs: React.FC<{ seats: number; shape: 'square' | 'rectangle' | 'round' }> = ({ seats, shape }) => {
  const chairs: React.ReactNode[] = [];
  
  if (shape === 'round') {
    // Distribute chairs in a circle around the round table
    for (let i = 0; i < seats; i++) {
      const angle = (i * 360) / seats;
      const radius = 55; // percentage radius
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
      chairs.push(
        <div
          key={i}
          className="absolute w-3.5 h-3.5 rounded-full bg-[#5f758a] border border-[#485b6e] shadow-sm transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      );
    }
    return <>{chairs}</>;
  }

  // Rectangle / Square layout
  if (seats <= 2) {
    // 2 seats: Left & Right
    chairs.push(
      <div key="L" className="absolute w-2 h-6 -left-2.5 top-1/2 transform -translate-y-1/2 rounded-l-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="R" className="absolute w-2 h-6 -right-2.5 top-1/2 transform -translate-y-1/2 rounded-r-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />
    );
  } else if (seats <= 4 || shape === 'square') {
    // 4 seats: Top, Bottom, Left, Right
    chairs.push(
      <div key="T" className="absolute h-2 w-6 -top-2.5 left-1/2 transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B" className="absolute h-2 w-6 -bottom-2.5 left-1/2 transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="L" className="absolute w-2 h-6 -left-2.5 top-1/2 transform -translate-y-1/2 rounded-l-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="R" className="absolute w-2 h-6 -right-2.5 top-1/2 transform -translate-y-1/2 rounded-r-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />
    );
  } else if (seats <= 6) {
    // 6 seats: 2 Top, 2 Bottom, 1 Left, 1 Right
    chairs.push(
      <div key="T1" className="absolute h-2 w-6 -top-2.5 left-[30%] transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="T2" className="absolute h-2 w-6 -top-2.5 left-[70%] transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B1" className="absolute h-2 w-6 -bottom-2.5 left-[30%] transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B2" className="absolute h-2 w-6 -bottom-2.5 left-[70%] transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="L" className="absolute w-2 h-6 -left-2.5 top-1/2 transform -translate-y-1/2 rounded-l-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="R" className="absolute w-2 h-6 -right-2.5 top-1/2 transform -translate-y-1/2 rounded-r-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />
    );
  } else {
    // 8+ seats: 3 Top, 3 Bottom, 1 Left, 1 Right
    chairs.push(
      <div key="T1" className="absolute h-2 w-6 -top-2.5 left-[25%] transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="T2" className="absolute h-2 w-6 -top-2.5 left-[50%] transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="T3" className="absolute h-2 w-6 -top-2.5 left-[75%] transform -translate-x-1/2 rounded-t-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B1" className="absolute h-2 w-6 -bottom-2.5 left-[25%] transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B2" className="absolute h-2 w-6 -bottom-2.5 left-[50%] transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="B3" className="absolute h-2 w-6 -bottom-2.5 left-[75%] transform -translate-x-1/2 rounded-b-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="L" className="absolute w-2 h-6 -left-2.5 top-1/2 transform -translate-y-1/2 rounded-l-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />,
      <div key="R" className="absolute w-2 h-6 -right-2.5 top-1/2 transform -translate-y-1/2 rounded-r-md bg-[#5f758a] border border-[#485b6e] shadow-sm" />
    );
  }

  return <>{chairs}</>;
};

export const Floors: React.FC = () => {
  const qc = useQueryClient();
  const { data: serverFloors = [], isLoading } = useQuery({ queryKey: ['floors'], queryFn: floorService.mockGetAll });

  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Modals state
  const [floorForm, setFloorForm] = useState(false);
  const [editFloor, setEditFloor] = useState<Floor | undefined>();
  const [tableForm, setTableForm] = useState<{ open: boolean; floorId: string; table?: Table }>({ open: false, floorId: '' });
  const [delFloor, setDelFloor] = useState<Floor | undefined>();
  const [delTable, setDelTable] = useState<Table | undefined>();
  
  // Local state for tables layout override
  const [localTables, setLocalTables] = useState<Record<string, Table[]>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef<{ tableId: string; startX: number; startY: number; tableStartX: number; tableStartY: number } | null>(null);
  const resizeInfo = useRef<{ tableId: string; startX: number; startY: number; tableStartW: number; tableStartH: number } | null>(null);

  // Sync server data to local storage on first load or change
  useEffect(() => {
    if (serverFloors.length > 0) {
      const initialTables: Record<string, Table[]> = {};
      serverFloors.forEach(f => {
        const stored = localStorage.getItem(`odoo_cafe_tables_${f.id}`);
        if (stored) {
          try {
            initialTables[f.id] = JSON.parse(stored);
          } catch (e) {
            initialTables[f.id] = f.tables;
          }
        } else {
          initialTables[f.id] = f.tables;
          localStorage.setItem(`odoo_cafe_tables_${f.id}`, JSON.stringify(f.tables));
        }
      });
      setLocalTables(initialTables);
      if (!activeFloorId) {
        setActiveFloorId(serverFloors[0].id);
      }
    }
  }, [serverFloors]);

  // Mutations
  const removeFloor = useMutation({
    mutationFn: (id: string) => floorService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['floors'] });
      setDelFloor(undefined);
    }
  });

  const currentFloorId = activeFloorId ?? serverFloors[0]?.id ?? null;
  const currentFloor = serverFloors.find(f => f.id === currentFloorId);
  const currentTables = currentFloorId ? (localTables[currentFloorId] || []) : [];

  // Update a single table state locally and save to localStorage
  const saveTableLocal = (table: Table) => {
    if (!currentFloorId) return;
    const existingIndex = currentTables.findIndex(t => t.id === table.id);
    let updatedList = [...currentTables];
    if (existingIndex >= 0) {
      updatedList[existingIndex] = table;
    } else {
      updatedList.push(table);
    }
    const newLocalTables = { ...localTables, [currentFloorId]: updatedList };
    setLocalTables(newLocalTables);
    localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(updatedList));
  };

  // Delete a table locally
  const deleteTableLocal = (tableId: string) => {
    if (!currentFloorId) return;
    const updatedList = currentTables.filter(t => t.id !== tableId);
    const newLocalTables = { ...localTables, [currentFloorId]: updatedList };
    setLocalTables(newLocalTables);
    localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(updatedList));
    setSelectedTableId(null);
    setDelTable(undefined);
  };

  // Add a new default table
  const addDefaultTable = () => {
    if (!currentFloorId) return;
    const maxNum = currentTables.reduce((max, t) => Math.max(max, t.tableNumber), 0);
    const newTable: Table = {
      id: `t_${Date.now()}`,
      floorId: currentFloorId,
      tableNumber: maxNum + 1,
      numberOfSeats: 4,
      isActive: true,
      hasActiveOrder: false,
      x: 45,
      y: 45,
      width: 10,
      height: 14,
      shape: 'square',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveTableLocal(newTable);
    setSelectedTableId(newTable.id);
  };

  // Drag and drop event handlers
  const handleTableMouseDown = (e: React.MouseEvent, table: Table) => {
    if (!editMode) return;
    e.stopPropagation();
    setSelectedTableId(table.id);

    dragInfo.current = {
      tableId: table.id,
      startX: e.clientX,
      startY: e.clientY,
      tableStartX: table.x ?? 10,
      tableStartY: table.y ?? 10,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resize event handlers
  const handleResizeMouseDown = (e: React.MouseEvent, table: Table) => {
    if (!editMode) return;
    e.stopPropagation();
    e.preventDefault();

    resizeInfo.current = {
      tableId: table.id,
      startX: e.clientX,
      startY: e.clientY,
      tableStartW: table.width ?? 12,
      tableStartH: table.height ?? 12,
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !currentFloorId) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    if (dragInfo.current) {
      const { tableId, startX, startY, tableStartX, tableStartY } = dragInfo.current;
      const dx = ((e.clientX - startX) / containerRect.width) * 100;
      const dy = ((e.clientY - startY) / containerRect.height) * 100;

      // Keep within bounds
      let newX = Math.round(tableStartX + dx);
      let newY = Math.round(tableStartY + dy);
      newX = Math.max(1, Math.min(newX, 90));
      newY = Math.max(1, Math.min(newY, 90));

      const updated = currentTables.map(t => t.id === tableId ? { ...t, x: newX, y: newY } : t);
      setLocalTables(prev => ({ ...prev, [currentFloorId]: updated }));
    }

    if (resizeInfo.current) {
      const { tableId, startX, startY, tableStartW, tableStartH } = resizeInfo.current;
      const dx = ((e.clientX - startX) / containerRect.width) * 100;
      const dy = ((e.clientY - startY) / containerRect.height) * 100;

      let newW = Math.round(tableStartW + dx);
      let newH = Math.round(tableStartH + dy);
      newW = Math.max(6, Math.min(newW, 40));
      newH = Math.max(6, Math.min(newH, 40));

      const updated = currentTables.map(t => t.id === tableId ? { ...t, width: newW, height: newH } : t);
      setLocalTables(prev => ({ ...prev, [currentFloorId]: updated }));
    }
  };

  const handleMouseUp = () => {
    if (dragInfo.current && currentFloorId) {
      const currentList = localTables[currentFloorId] || [];
      localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(currentList));
    }
    if (resizeInfo.current && currentFloorId) {
      const currentList = localTables[currentFloorId] || [];
      localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(currentList));
    }
    dragInfo.current = null;
    resizeInfo.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Quick settings updates
  const updateTableShape = (table: Table, shape: 'square' | 'rectangle' | 'round') => {
    const updated = { ...table, shape, width: shape === 'rectangle' ? 16 : 10, height: 14 };
    saveTableLocal(updated);
  };

  const adjustSeats = (table: Table, diff: number) => {
    const seats = Math.max(1, table.numberOfSeats + diff);
    saveTableLocal({ ...table, numberOfSeats: seats });
  };

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  // Analytics derived from current visual state
  const allTables = Object.values(localTables).flat().filter(Boolean);
  const activeTables = allTables.filter(t => t && t.hasActiveOrder).length;
  const totalSeats = allTables.reduce((s, t) => s + ((t && t.numberOfSeats) || 0), 0);
  const filledSeats = allTables.filter(t => t && t.hasActiveOrder).reduce((s, t) => s + ((t && t.numberOfSeats) || 0), 0);
  const occupiedPct = allTables.length ? Math.round((activeTables / allTables.length) * 100) : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      {/* Top Panel Actions / Header */}
      <div className="flex items-center justify-between pb-3 flex-wrap gap-2 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-teal-50 text-teal-600 p-2 rounded-lg">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">Dining Room & Floor Plans</h2>
            <p className="text-[11px] text-gray-400">Configure visual seating layouts and map orders to tables.</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Floor Switcher */}
          <div className="flex bg-gray-100 border border-gray-200 rounded-lg p-1">
            {serverFloors.map(floor => (
              <button
                key={floor.id}
                onClick={() => {
                  setActiveFloorId(floor.id);
                  setSelectedTableId(null);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all whitespace-nowrap
                  ${floor.id === currentFloorId ? 'bg-white shadow text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {floor.name} ({currentTables.length} Tables)
              </button>
            ))}
            <button
              onClick={() => { setEditFloor(undefined); setFloorForm(true); }}
              className="px-2 py-1 text-teal-600 hover:bg-white rounded-md text-xs font-bold transition-all"
              title="Add New Floor"
            >
              + Floor
            </button>
          </div>

          <Button
            onClick={() => setEditMode(!editMode)}
            variant={editMode ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-1.5 text-xs h-8"
          >
            {editMode ? <Check className="w-3.5 h-3.5 text-white" /> : <Settings className="w-3.5 h-3.5" />}
            {editMode ? 'Done Editing' : 'Edit Layout'}
          </Button>

          {editMode && (
            <Button onClick={addDefaultTable} variant="default" size="sm" className="flex items-center gap-1 h-8 text-xs bg-teal-600 hover:bg-teal-700">
              <Plus className="w-3.5 h-3.5" /> Add Table
            </Button>
          )}

          {currentFloor && (
            <div className="flex gap-1">
              <button
                onClick={() => { setEditFloor(currentFloor); setFloorForm(true); }}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-teal-600"
                title="Edit floor name"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDelFloor(currentFloor)}
                className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                title="Delete this floor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Floor Plan Grid */}
      <div className="flex-1 flex overflow-hidden py-4 gap-4">
        {/* Layout Map Area */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative">
          
          {/* Header of Floor Plan */}
          <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Info className="w-3 h-3 text-teal-600" />
              {editMode ? 'Layout Editor Mode — Drag to move, grab handle to resize' : 'Interactive Map — Click table to view or take orders'}
            </span>
            <div className="flex gap-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block border border-emerald-600" /> Occupied</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#ebdcb9] inline-block border border-amber-700" /> Vacant</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-gray-300 inline-block border border-gray-400" /> OOS Closed</span>
            </div>
          </div>

          {/* Wooden Floor Board Container */}
          <div
            ref={containerRef}
            className="flex-1 relative overflow-hidden bg-[#e2d7c5] p-2 border border-inset select-none"
            style={{
              backgroundImage: 'radial-gradient(#bfae99 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
            onClick={() => setSelectedTableId(null)}
          >
            {/* Render Fixed Kitchen & Counter Decoration (Left Side) */}
            {currentFloorId === '1' && (
              <>
                {/* Kitchen Wall Slate */}
                <div className="absolute left-0 top-0 bottom-[30%] w-[20%] bg-slate-400 border-r-4 border-slate-700 p-2 shadow-md flex flex-col justify-between text-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Kitchen & Prep</div>
                  {/* Stoves */}
                  <div className="grid grid-cols-2 gap-2 my-2">
                    <div className="aspect-square bg-slate-300 border-2 border-slate-400 rounded-lg flex items-center justify-center flex-col p-1 gap-1">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /></div>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /></div>
                    </div>
                    <div className="aspect-square bg-slate-300 border-2 border-slate-400 rounded-lg flex items-center justify-center flex-col p-1 gap-1">
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /></div>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-slate-500" /></div>
                    </div>
                  </div>
                  {/* Sinks */}
                  <div className="bg-slate-300 border-2 border-slate-400 rounded-lg p-1.5 flex justify-around">
                    <div className="w-5 h-5 border border-slate-500 rounded flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-slate-500" /></div>
                    <div className="w-5 h-5 border border-slate-500 rounded flex items-center justify-center"><div className="w-2.5 h-2.5 rounded-full bg-slate-500" /></div>
                  </div>
                </div>

                {/* Host Reception Counter */}
                <div
                  className="absolute left-[8%] bottom-[8%] w-[10%] h-[12%] bg-[#ebdcb9] border-2 border-amber-800 rounded-lg shadow-md flex flex-col items-center justify-center text-[10px] font-bold text-amber-900"
                  title="Host Desk"
                >
                  <span>💻 Desk</span>
                  <div className="w-4 h-4 rounded bg-orange-400 border border-orange-600 mt-1 shadow-sm" title="Host Chair" />
                </div>

                {/* Main separator wall */}
                <div className="absolute left-[20%] top-0 bottom-[30%] w-1.5 bg-slate-700 shadow" />
              </>
            )}

            {/* Render Tables */}
            {currentTables.map(t => {
              const isSelected = selectedTableId === t.id;
              const isOos = t.isOutOfService;
              const hasOrder = t.hasActiveOrder;

              // Compute background color based on status
              let bgClass = 'bg-[#ebdcb9] border-amber-700 hover:bg-[#eedfc4]';
              let textClass = 'text-amber-900';
              if (isOos) {
                bgClass = 'bg-gray-300 border-gray-400 opacity-60';
                textClass = 'text-gray-500';
              } else if (hasOrder) {
                bgClass = 'bg-emerald-500 border-emerald-600 hover:bg-emerald-400';
                textClass = 'text-white';
              }

              return (
                <div
                  key={t.id}
                  onMouseDown={(e) => handleTableMouseDown(e, t)}
                  className={`absolute border-2 shadow-md flex flex-col items-center justify-center transition-shadow select-none
                    ${t.shape === 'round' ? 'rounded-full' : 'rounded-lg'}
                    ${isSelected ? 'ring-4 ring-amber-400 border-amber-500 z-30 shadow-lg' : 'z-10'}
                    ${editMode ? 'cursor-move' : 'cursor-pointer'}
                    ${bgClass}
                  `}
                  style={{
                    left: `${t.x ?? 10}%`,
                    top: `${t.y ?? 10}%`,
                    width: `${t.width ?? 10}%`,
                    height: `${t.height ?? 14}%`,
                  }}
                >
                  {/* Chairs surrounding table */}
                  <TableChairs seats={t.numberOfSeats} shape={t.shape ?? 'square'} />

                  {/* Table Details */}
                  <div className={`text-center flex flex-col items-center justify-center w-full px-1 ${textClass}`}>
                    <span className="text-sm font-black tracking-tight leading-none">{t.tableNumber}</span>
                    <span className="text-[8px] opacity-75 font-bold leading-none mt-0.5">{t.numberOfSeats} Seats</span>
                    {hasOrder && !isOos && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-4.5 h-4.5 rounded-full text-[9px] font-black flex items-center justify-center animate-bounce shadow">
                        {t.pendingItemsCount || 1}
                      </span>
                    )}
                  </div>

                  {/* Resizer Handle (Edit Mode only) */}
                  {editMode && isSelected && (
                    <div
                      onMouseDown={(e) => handleResizeMouseDown(e, t)}
                      className="absolute right-0 bottom-0 p-1 cursor-se-resize bg-amber-400 border-l border-t border-amber-500 rounded-br-lg z-40"
                      title="Drag to resize"
                    >
                      <Maximize2 className="w-2.5 h-2.5 text-amber-900" />
                    </div>
                  )}

                  {/* Selected Table Mini Editor Toolbar */}
                  {editMode && isSelected && (
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white flex items-center gap-1.5 px-2 py-1 rounded-md text-xs shadow-lg z-50 whitespace-nowrap">
                      <button
                        onClick={() => adjustSeats(t, 1)}
                        className="w-5 h-5 rounded hover:bg-slate-700 flex items-center justify-center font-bold"
                        title="Add seat"
                      >
                        +
                      </button>
                      <span className="font-semibold">{t.numberOfSeats}</span>
                      <button
                        onClick={() => adjustSeats(t, -1)}
                        className="w-5 h-5 rounded hover:bg-slate-700 flex items-center justify-center font-bold"
                        title="Remove seat"
                      >
                        -
                      </button>
                      <div className="w-[1px] h-3 bg-slate-700" />
                      <button
                        onClick={() => updateTableShape(t, t.shape === 'round' ? 'square' : t.shape === 'square' ? 'rectangle' : 'round')}
                        className="px-1.5 py-0.5 rounded hover:bg-slate-700 text-[10px] font-bold"
                        title="Change shape"
                      >
                        Shape
                      </button>
                      <button
                        onClick={() => setTableForm({ open: true, floorId: currentFloorId, table: t })}
                        className="p-1 rounded hover:bg-slate-700 text-teal-400"
                        title="Edit properties"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDelTable(t)}
                        className="p-1 rounded hover:bg-red-950 text-red-400"
                        title="Delete table"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Table / Analytics Panel (Right Side) */}
        <div className="w-72 flex flex-col gap-4 overflow-y-auto">
          {/* Quick-Action Panel for Selected Table */}
          {selectedTableId && !editMode && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              {(() => {
                const table = currentTables.find(t => t.id === selectedTableId);
                if (!table) return null;
                return (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-gray-900">Table {table.tableNumber}</h3>
                        <p className="text-xs text-gray-400">{table.numberOfSeats} Seats Capacity</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                        ${table.isOutOfService ? 'bg-red-50 text-red-500' : table.hasActiveOrder ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'}`}>
                        {table.isOutOfService ? 'OOS Closed' : table.hasActiveOrder ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
                      {table.hasActiveOrder ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Order Items:</span>
                            <span className="font-semibold text-gray-900">{table.pendingItemsCount ?? 1} pending</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Bill Total:</span>
                            <span className="font-extrabold text-teal-600">${(table.currentTotal ?? 24.15).toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-center py-2">No active orders on this table.</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Button
                        size="sm"
                        className="w-full text-[11px] font-bold bg-teal-600 hover:bg-teal-700"
                        onClick={() => {
                          // Quick Order / POS simulation or navigation
                          alert(`Opening Order POS for Table ${table.tableNumber}`);
                        }}
                      >
                        New Order
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-[11px]"
                        onClick={() => {
                          saveTableLocal({ ...table, isOutOfService: !table.isOutOfService });
                        }}
                      >
                        {table.isOutOfService ? 'Make Active' : 'Set OOS'}
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Seating Capacity Circle Progress */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Seating Capacity</h4>
            <p className="text-[10px] text-gray-400 mb-4">Table distribution vs seating capacity.</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                  <circle
                    cx="18" cy="18" r="16" fill="none" stroke="#00a09d" strokeWidth="3.5"
                    strokeDasharray={`${occupiedPct} ${100 - occupiedPct}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-900">{occupiedPct}%</span>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">Active Tables</span>
                  <p className="font-bold text-gray-800">{activeTables} / {allTables.length} Active</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-medium">Seats Occupied</span>
                  <p className="font-bold text-gray-800">{filledSeats} of {totalSeats}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone Traffic Analytics */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-1">Zone Occupancy</h4>
            <p className="text-[10px] text-gray-400 mb-3">Live occupancy percentage per floor plan zone.</p>
            <div className="space-y-3">
              {serverFloors.map(floor => {
                const tables = localTables[floor.id] || [];
                const active = tables.filter(t => t.hasActiveOrder).length;
                const pct = tables.length ? Math.round((active / tables.length) * 100) : 0;
                return (
                  <div key={floor.id} className="text-xs">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <span className="text-gray-700">{floor.name}</span>
                      <span className="text-teal-600">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <FloorFormModal open={floorForm} onClose={() => setFloorForm(false)} initial={editFloor} />
      
      <TableFormModal
        open={tableForm.open}
        onClose={() => setTableForm({ open: false, floorId: '' })}
        floorId={tableForm.floorId}
        initial={tableForm.table}
        onSaveLocal={saveTableLocal}
      />
      
      <ConfirmDeleteModal
        open={!!delFloor}
        onClose={() => setDelFloor(undefined)}
        onConfirm={() => delFloor && removeFloor.mutate(delFloor.id)}
        loading={removeFloor.isPending}
        message={`Delete floor "${delFloor?.name}"?`}
      />

      <ConfirmDeleteModal
        open={!!delTable}
        onClose={() => setDelTable(undefined)}
        onConfirm={() => delTable && deleteTableLocal(delTable.id)}
        loading={false}
        message={`Delete Table ${delTable?.tableNumber}?`}
      />
    </div>
  );
};