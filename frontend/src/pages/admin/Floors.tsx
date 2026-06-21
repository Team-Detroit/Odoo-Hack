import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useTableStore, getActiveTableId } from '../../store/tableStore';
import { useCartStore } from '../../store/cartStore';
import { floorService } from '../../services/floorService';
import { tableService } from '../../services/tableService';
import { customerService } from '../../services/customerService';
import { CustomerAssignmentModal } from '../../components/pos/CustomerAssignmentModal';
import { Floor } from '../../types/floor';
import { Table } from '../../types/table';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { Spinner } from '../../components/common/Spinner';
import razorpayService from '../../services/razorpayService';
import { 
  Move, Maximize2, Trash2, Edit2, Plus, Check, Settings, Layout, Info, Monitor, Grid,
  Calendar, Clock, User, Phone, Mail, Loader2, CreditCard, Smartphone
} from 'lucide-react';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export interface Reservation {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  email?: string;
  phone?: string;
  reserveTime: string; // ISO String
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'SEATED' | 'CANCELLED';
  amount: number;
  paymentMethod: 'CASH' | 'CARD' | 'UPI';
}

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

const TableFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  floorId: string;
  initial?: Table;
  nextTableNumber: number;
  onSaveLocal: (tableOrTables: Table | Table[]) => void;
}> = ({ open, onClose, floorId, initial, nextTableNumber, onSaveLocal }) => {
  const [tableNumber, setTableNumber] = useState<number | ''>(initial?.tableNumber ?? nextTableNumber);
  const [seats, setSeats] = useState<number | ''>(initial?.numberOfSeats ?? 2);
  const [shape, setShape] = useState<'square' | 'rectangle' | 'round'>(initial?.shape ?? 'square');
  const [isOos, setIsOos] = useState(initial?.isOutOfService ?? false);
  const [multiplier, setMultiplier] = useState<number | ''>(1);

  useEffect(() => {
    if (initial) {
      setTableNumber(initial.tableNumber);
      setSeats(initial.numberOfSeats);
      setShape(initial.shape ?? 'square');
      setIsOos(initial.isOutOfService ?? false);
    } else {
      setTableNumber(nextTableNumber);
      setSeats(2);
      setShape('square');
      setIsOos(false);
      setMultiplier(1);
    }
  }, [initial, open, nextTableNumber]);

  const handleSave = () => {
    const finalTableNumber = tableNumber === '' ? 1 : tableNumber;
    const finalSeats = seats === '' ? 2 : seats;

    if (initial) {
      const updatedTable: Table = {
        ...initial,
        tableNumber: finalTableNumber,
        numberOfSeats: finalSeats,
        shape,
        isOutOfService: isOos,
        updatedAt: new Date().toISOString(),
      };
      onSaveLocal(updatedTable);
    } else {
      const tables: Table[] = [];
      const nowStr = new Date().toISOString();
      const count = Math.max(1, Math.min(20, multiplier === '' ? 1 : multiplier));
      for (let i = 0; i < count; i++) {
        const xOffset = 40 + i * 5;
        const yOffset = 40 + i * 5;
        const boundedX = Math.max(1, Math.min(xOffset, 90));
        const boundedY = Math.max(1, Math.min(yOffset, 90));

        tables.push({
          id: `t_${Date.now()}_${i}`,
          floorId,
          isActive: true,
          hasActiveOrder: false,
          x: boundedX,
          y: boundedY,
          width: shape === 'rectangle' ? 16 : 10,
          height: 14,
          tableNumber: finalTableNumber + i,
          numberOfSeats: finalSeats,
          shape,
          isOutOfService: isOos,
          createdAt: nowStr,
          updatedAt: nowStr,
        });
      }
      onSaveLocal(tables);
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Table Properties' : 'Add Table'} size="sm">
      <div className="space-y-4">
        <Input 
          label="Table Number" 
          type="number" 
          value={tableNumber} 
          onChange={e => setTableNumber(e.target.value === '' ? '' : Number(e.target.value))} 
        />
        {!initial && (
          <Input 
            label="Multiplier (Quantity to Add)" 
            type="number" 
            min={1} 
            max={20} 
            value={multiplier} 
            onChange={e => setMultiplier(e.target.value === '' ? '' : Number(e.target.value))} 
          />
        )}
        <Input 
          label="Number of Seats" 
          type="number" 
          value={seats} 
          onChange={e => setSeats(e.target.value === '' ? '' : Number(e.target.value))} 
        />
        
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
  const navigate = useNavigate();
  const { setSelectedTable, selectedTable: cartSelectedTable } = useTableStore();
  // Read synchronously from localStorage on first render — no async hydration wait
  const [sessionTableId] = useState<string | null>(() => getActiveTableId());
  const { data: serverFloors = [], isLoading } = useQuery({ queryKey: ['floors'], queryFn: floorService.mockGetAll });

  const [activeFloorId, setActiveFloorId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Reservation feature states
  const [activeTab, setActiveTab] = useState<'layout' | 'reservations'>('layout');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

  // New Reservation Form state
  const [newResName, setNewResName] = useState('');
  const [newResEmail, setNewResEmail] = useState('');
  const [newResPhone, setNewResPhone] = useState('');
  const [newResTableId, setNewResTableId] = useState('');
  const [newResTime, setNewResTime] = useState('');
  const [newResAmount, setNewResAmount] = useState<number>(500);
  const [newResPayMethod, setNewResPayMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [newResIsOnline, setNewResIsOnline] = useState(false);
  const [resLoading, setResLoading] = useState(false);

  // Filters for Reservations tab
  const [resStatusFilter, setResStatusFilter] = useState<string>('ALL');
  const [resDateFilter, setResDateFilter] = useState<string>('');

  const handleSeatCustomer = async (reservation: Reservation, table: Table) => {
    try {
      let customerId = '';
      if (reservation.customerName) {
        try {
          const customer = await customerService.create({ 
            name: reservation.customerName, 
            email: reservation.email || '' 
          });
          customerId = customer.id;
        } catch (err) {
          console.error("Failed to create customer record in DB:", err);
        }
      }
      useCartStore.getState().setCustomer(customerId);

      // Update reservation status to SEATED
      const updatedReservations = reservations.map(r => 
        r.id === reservation.id ? { ...r, status: 'SEATED' as const } : r
      );
      saveReservations(updatedReservations);

      // Mark table as OCCUPIED
      await tableService.updateStatus(table.id, 'OCCUPIED');
      const updatedTable = { ...table, status: 'OCCUPIED' as const };
      saveTableLocal(updatedTable);
      qc.invalidateQueries({ queryKey: ['floors'] });

      let activeTable = table;
      if (table.id.startsWith('t_')) {
        const dbTable = await tableService.create({
          floorId: table.floorId,
          tableNumber: table.tableNumber,
          numberOfSeats: table.numberOfSeats,
          isOutOfService: table.isOutOfService,
          x: table.x,
          y: table.y,
          width: table.width,
          height: table.height,
          shape: table.shape
        });
        const createdTable = Array.isArray(dbTable) ? dbTable[0] : dbTable;
        if (createdTable && createdTable.id) {
          activeTable = { ...table, id: createdTable.id };
        }
      }
      setSelectedTable(activeTable);
      navigate(ROUTES.POS);
    } catch (e: any) {
      console.error("Failed to seat customer:", e);
      alert("Failed to seat customer: " + e.message);
    }
  };

  const handlePaymentCheckout = async (reservation: Reservation, table: Table) => {
    try {
      setResLoading(true);
      const { order: rzpOrder, key: rzpKey } = await razorpayService.createOrder(reservation.amount);
      
      const options = {
        key: rzpKey,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'Odoo Cafe',
        description: `Reservation Payment - Table ${table.tableNumber}`,
        order_id: rzpOrder.id,
        prefill: {
          name: reservation.customerName,
          email: reservation.email || undefined,
          contact: reservation.phone || undefined,
          method: 'upi'
        },
        theme: { color: '#7c3aed' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await razorpayService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Mark reservation as CONFIRMED
            const updated = reservations.map(r => 
              r.id === reservation.id ? { ...r, status: 'CONFIRMED' as const } : r
            );
            saveReservations(updated);

            // Mark table as RESERVED
            await tableService.updateStatus(table.id, 'RESERVED');
            saveTableLocal({ ...table, status: 'RESERVED' as const });
            qc.invalidateQueries({ queryKey: ['floors'] });
            
            alert('Reservation payment successful and table reserved!');
          } catch (err: any) {
            console.error('Payment verification failed:', err);
            alert('Payment verification failed: ' + err.message);
          } finally {
            setResLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            alert('Payment checkout cancelled.');
            setResLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay initialization failed:', err);
      alert('Razorpay failed: ' + err.message);
      setResLoading(false);
    }
  };

  const handleCreateReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName || !newResTableId || !newResTime || !newResAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    const table = currentTables.find(t => t.id === newResTableId);
    if (!table) return;

    const newRes: Reservation = {
      id: `res_${Date.now()}`,
      tableId: newResTableId,
      tableNumber: table.tableNumber,
      customerName: newResName,
      email: newResEmail || undefined,
      phone: newResPhone || undefined,
      reserveTime: new Date(newResTime).toISOString(),
      status: newResIsOnline ? 'PENDING_PAYMENT' : 'CONFIRMED',
      amount: Number(newResAmount),
      paymentMethod: newResPayMethod,
    };

    if (newResIsOnline) {
      try {
        setResLoading(true);
        const { order: rzpOrder, key: rzpKey } = await razorpayService.createOrder(newRes.amount);
        
        const options = {
          key: rzpKey,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Odoo Cafe',
          description: `Reservation Payment - Table ${table.tableNumber}`,
          order_id: rzpOrder.id,
          prefill: {
            name: newRes.customerName,
            email: newRes.email || undefined,
            contact: newRes.phone || undefined,
            method: 'upi'
          },
          theme: { color: '#7c3aed' },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              await razorpayService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              newRes.status = 'CONFIRMED';
              const updatedList = [...reservations, newRes];
              saveReservations(updatedList);

              await tableService.updateStatus(table.id, 'RESERVED');
              saveTableLocal({ ...table, status: 'RESERVED' as const });
              qc.invalidateQueries({ queryKey: ['floors'] });

              setReservationModalOpen(false);
              clearReservationForm();
              alert('Reservation confirmed via online payment!');
            } catch (err: any) {
              console.error('Payment verification failed:', err);
              const updatedList = [...reservations, newRes];
              saveReservations(updatedList);
              alert('Payment verification failed. Reservation is saved as PENDING.');
            } finally {
              setResLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              const updatedList = [...reservations, newRes];
              saveReservations(updatedList);
              setReservationModalOpen(false);
              clearReservationForm();
              alert('Payment cancelled. Reservation is saved as PENDING_PAYMENT.');
              setResLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err: any) {
        console.error('Failed online order creation:', err);
        const updatedList = [...reservations, newRes];
        saveReservations(updatedList);
        setReservationModalOpen(false);
        clearReservationForm();
        alert('Could not start online payment. Reservation saved as PENDING_PAYMENT.');
        setResLoading(false);
      }
    } else {
      const updatedList = [...reservations, newRes];
      saveReservations(updatedList);

      try {
        await tableService.updateStatus(table.id, 'RESERVED');
        saveTableLocal({ ...table, status: 'RESERVED' as const });
        qc.invalidateQueries({ queryKey: ['floors'] });
      } catch (err) {
        console.error("Failed to update table status on server:", err);
      }

      setReservationModalOpen(false);
      clearReservationForm();
      alert('Reservation successfully created!');
    }
  };

  const clearReservationForm = () => {
    setNewResName('');
    setNewResEmail('');
    setNewResPhone('');
    setNewResTableId('');
    setNewResTime('');
    setNewResAmount(500);
    setNewResPayMethod('CASH');
    setNewResIsOnline(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('odoo_cafe_reservations');
    if (saved) {
      setReservations(JSON.parse(saved));
    } else {
      const demoReservations: Reservation[] = [
        {
          id: 'res_1',
          tableId: 't1',
          tableNumber: 1,
          customerName: 'Aishwarya Rai',
          email: 'aishwarya@example.com',
          phone: '9876543210',
          reserveTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          amount: 500,
          paymentMethod: 'UPI'
        },
        {
          id: 'res_2',
          tableId: 't2',
          tableNumber: 2,
          customerName: 'Shah Rukh Khan',
          email: 'srk@example.com',
          phone: '9822334455',
          reserveTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
          status: 'PENDING_PAYMENT',
          amount: 500,
          paymentMethod: 'CARD'
        }
      ];
      setReservations(demoReservations);
      localStorage.setItem('odoo_cafe_reservations', JSON.stringify(demoReservations));
    }
  }, []);

  const saveReservations = (updated: Reservation[]) => {
    setReservations(updated);
    localStorage.setItem('odoo_cafe_reservations', JSON.stringify(updated));
  };

  const getTableReservation = (tableId: string) => {
    return reservations.find(r => r.tableId === tableId && r.status === 'CONFIRMED');
  };

  // Modals state
  const [floorForm, setFloorForm] = useState(false);
  const [editFloor, setEditFloor] = useState<Floor | undefined>();
  const [tableForm, setTableForm] = useState<{ open: boolean; floorId: string; table?: Table }>({ open: false, floorId: '' });
  const [delFloor, setDelFloor] = useState<Floor | undefined>();
  const [delTable, setDelTable] = useState<Table | undefined>();
  const [customerModal, setCustomerModal] = useState<{ open: boolean; table?: Table }>({ open: false });
  
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
        initialTables[f.id] = f.tables;
        localStorage.setItem(`odoo_cafe_tables_${f.id}`, JSON.stringify(f.tables));
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

  // Update single or multiple tables state locally and save to localStorage
  const saveTableLocal = (tableOrTables: Table | Table[]) => {
    if (!currentFloorId) return;
    let updatedList = [...currentTables];
    const tablesToSave = Array.isArray(tableOrTables) ? tableOrTables : [tableOrTables];
    
    tablesToSave.forEach(table => {
      const existingIndex = updatedList.findIndex(t => t.id === table.id);
      if (existingIndex >= 0) {
        updatedList[existingIndex] = table;
      } else {
        updatedList.push(table);
      }
    });

    const newLocalTables = { ...localTables, [currentFloorId]: updatedList };
    setLocalTables(newLocalTables);
    localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(updatedList));
  };

  // Delete a table locally
  const deleteTableLocal = (tableId: string) => {
    if (!currentFloorId) return;
    const updatedList = currentTables.filter(t => t && t.id !== tableId);
    const newLocalTables = { ...localTables, [currentFloorId]: updatedList };
    setLocalTables(newLocalTables);
    localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(updatedList));
    setSelectedTableId(null);
    setDelTable(undefined);
  };

  // Auto arrange all tables on the current floor based on their table numbers
  const autoArrangeTables = () => {
    if (!currentFloorId || currentTables.length === 0) return;
    const sorted = [...currentTables].sort((a, b) => a.tableNumber - b.tableNumber);
    const cols = 5;
    const colWidth = 18; // spacing X
    const rowHeight = 20; // spacing Y
    const startX = 5;
    const startY = 5;

    const arranged = sorted.map((table, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = startX + col * colWidth;
      const y = startY + row * rowHeight;
      return {
        ...table,
        x: Math.max(1, Math.min(x, 90)),
        y: Math.max(1, Math.min(y, 90)),
      };
    });

    // Save all arranged tables
    const newLocalTables = { ...localTables, [currentFloorId]: arranged };
    setLocalTables(newLocalTables);
    localStorage.setItem(`odoo_cafe_tables_${currentFloorId}`, JSON.stringify(arranged));
  };

  const handleTableClick = async (table: Table) => {
    if (table.isOutOfService) return;
    
    const reservation = getTableReservation(table.id);
    if (table.status === 'RESERVED' || !!reservation) {
      setSelectedTableId(table.id);
      return;
    }

    const isOccupied = table.status === 'OCCUPIED' || table.hasActiveOrder || (cartSelectedTable?.id === table.id);

    if (isOccupied) {
      const confirmFree = window.confirm(`Table T${table.tableNumber} is currently occupied. Would you like to free it up and make it available?`);
      if (confirmFree) {
        try {
          await tableService.updateStatus(table.id, 'AVAILABLE');
          
          const updatedTable = { ...table, status: 'AVAILABLE' as const, hasActiveOrder: false };
          saveTableLocal(updatedTable);

          // Clear active cart table if this one was being used
          if (cartSelectedTable?.id === table.id) {
            setSelectedTable(null);
          }
          
          qc.invalidateQueries({ queryKey: ['floors'] });
          alert(`Table T${table.tableNumber} is now freed and available!`);
        } catch (err: any) {
          console.error("Failed to free table:", err);
          alert("Failed to free table: " + err.message);
        }
      }
      return;
    }

    setCustomerModal({ open: true, table });
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
  const allTables = localTables[currentFloorId] || [];
  const activeTables = allTables.filter(t => t && !t.isOutOfService).length;
  const totalSeats = allTables.reduce((s, t) => s + ((t && t.numberOfSeats) || 0), 0);
  const filledSeats = allTables.filter(t => t && (t.status === 'OCCUPIED' || t.hasActiveOrder)).reduce((s, t) => s + ((t && t.numberOfSeats) || 0), 0);
  const vacancyPct = totalSeats ? Math.round(((totalSeats - filledSeats) / totalSeats) * 100) : 100;

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
                {floor.name} ({(localTables[floor.id] || []).length} Tables)
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
            onClick={async () => {
              if (editMode) {
                try {
                  const list = localTables[currentFloorId] || [];
                  for (const t of list) {
                    if (t.id.startsWith('t_')) {
                      await tableService.create({
                        floorId: t.floorId,
                        tableNumber: t.tableNumber,
                        numberOfSeats: t.numberOfSeats,
                        isOutOfService: t.isOutOfService,
                        x: t.x,
                        y: t.y,
                        width: t.width,
                        height: t.height,
                        shape: t.shape
                      });
                    } else {
                      await tableService.update(t.id, {
                        floorId: t.floorId,
                        tableNumber: t.tableNumber,
                        numberOfSeats: t.numberOfSeats,
                        isOutOfService: t.isOutOfService,
                        x: t.x,
                        y: t.y,
                        width: t.width,
                        height: t.height,
                        shape: t.shape
                      });
                    }
                  }
                  qc.invalidateQueries({ queryKey: ['floors'] });
                } catch (err) {
                  console.error("Failed to save layout modifications:", err);
                }
              }
              setEditMode(!editMode);
            }}
            variant={editMode ? 'primary' : 'outline'}
            size="sm"
            className="flex items-center gap-1.5 text-xs h-8"
          >
            {editMode ? <Check className="w-3.5 h-3.5 text-white" /> : <Settings className="w-3.5 h-3.5" />}
            {editMode ? 'Done Editing' : 'Edit Layout'}
          </Button>

          {editMode && (
            <>
              <Button
                onClick={autoArrangeTables}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-8 text-xs border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                <Grid className="w-3.5 h-3.5" /> Auto Arrange
              </Button>
              <Button onClick={() => setTableForm({ open: true, floorId: currentFloorId })} variant="primary" size="sm" className="flex items-center gap-1 h-8 text-xs bg-teal-600 hover:bg-teal-700">
                <Plus className="w-3.5 h-3.5" /> Add Table
              </Button>
            </>
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

      {/* Tabs Switcher */}
      <div className="flex border-b border-gray-200 mt-2 bg-gray-50/50 rounded-t-lg">
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'layout' 
              ? 'border-teal-600 text-teal-600 font-extrabold bg-white rounded-tl-lg border-t-2 border-r-2 border-gray-200' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          Table Layout
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'reservations' 
              ? 'border-teal-600 text-teal-600 font-extrabold bg-white rounded-tr-lg border-t-2 border-l-2 border-gray-200' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Reservations
        </button>
      </div>

      {activeTab === 'layout' ? (
        /* Main Floor Plan Grid */
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
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block border border-orange-600" /> Occupied</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block border border-emerald-600" /> Vacant</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-600 inline-block border border-purple-700 animate-pulse" /> Reserved</span>
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
                    <div className="flex items-center gap-1">
                      <Monitor className="w-3 h-3 text-amber-800" />
                      <span>Desk</span>
                    </div>
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
                const reservation = getTableReservation(t.id);
                const isReserved = t.status === 'RESERVED' || !!reservation;
                const isOccupied = t.status === 'OCCUPIED' || t.hasActiveOrder ||
                  (cartSelectedTable?.id === t.id) || (sessionTableId === t.id);

                // Compute background color based on status
                let bgClass = 'bg-emerald-500 border-emerald-600 hover:bg-emerald-400';
                let textClass = 'text-white';
                if (isOos) {
                  bgClass = 'bg-gray-300 border-gray-400 opacity-60';
                  textClass = 'text-gray-500';
                } else if (isReserved) {
                  bgClass = 'bg-purple-600 border-purple-700 hover:bg-purple-500';
                  textClass = 'text-white';
                } else if (isOccupied) {
                  bgClass = 'bg-orange-500 border-orange-600 hover:bg-orange-400';
                  textClass = 'text-white';
                }

                return (
                  <div
                    key={t.id}
                    onMouseDown={(e) => handleTableMouseDown(e, t)}
                    onClick={(e) => {
                      if (editMode) return;
                      e.stopPropagation();
                      handleTableClick(t);
                    }}
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
                      {isOccupied && !isOos && (
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
                        <Maximize2 className="w-2.5 h-2.5 text-amber-950" />
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
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm animate-fade-in">
                {(() => {
                  const table = currentTables.find(t => t.id === selectedTableId);
                  if (!table) return null;

                  const reservation = getTableReservation(table.id);
                  if (reservation) {
                    return (
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-extrabold text-gray-900">Table {table.tableNumber}</h3>
                            <p className="text-xs text-purple-600 font-bold">Reserved Table</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-100">
                            {reservation.status}
                          </span>
                        </div>

                        <div className="border-t border-b border-gray-100 py-3 space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-purple-500" />
                            <span className="font-extrabold text-gray-800">{reservation.customerName}</span>
                          </div>
                          {reservation.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-600 font-semibold">{reservation.phone}</span>
                            </div>
                          )}
                          {reservation.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-gray-600 font-semibold truncate">{reservation.email}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(reservation.reserveTime).toLocaleDateString()} {new Date(reservation.reserveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-50">
                            <span className="text-gray-400 font-semibold">Reserve Fee Paid:</span>
                            <span className="font-black text-purple-700">₹{reservation.amount}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-2 pt-1">
                          <Button
                            size="sm"
                            className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1"
                            onClick={() => handleSeatCustomer(reservation, table)}
                          >
                            <Check className="w-3.5 h-3.5" /> Seat Customer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs font-bold border-red-200 hover:bg-red-50 text-red-600"
                            onClick={() => {
                              if (window.confirm("Are you sure you want to cancel this reservation?")) {
                                const updated = reservations.map(r => 
                                  r.id === reservation.id ? { ...r, status: 'CANCELLED' as const } : r
                                );
                                saveReservations(updated);
                                saveTableLocal({ ...table, status: 'AVAILABLE' as const });
                                tableService.updateStatus(table.id, 'AVAILABLE').catch(console.error);
                                qc.invalidateQueries({ queryKey: ['floors'] });
                              }
                            }}
                          >
                            Cancel Reservation
                          </Button>
                        </div>
                      </div>
                    );
                  }

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
                            handleTableClick(table);
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
                      strokeDasharray={`${vacancyPct} ${100 - vacancyPct}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-900">{vacancyPct}%</span>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Active Tables</span>
                    <p className="font-bold text-gray-800">{activeTables} / {allTables.length} Active</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Seats Occupied</span>
                    <p className="font-bold text-gray-800">{filledSeats} of {totalSeats}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-medium">Seats Available (Vacant)</span>
                    <p className="font-bold text-gray-800 text-teal-600">{totalSeats - filledSeats} of {totalSeats}</p>
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
                  const active = tables.filter(t => t && (t.status === 'OCCUPIED' || t.hasActiveOrder)).length;
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
      ) : (
        /* Reservations Management View */
        <div className="flex-1 flex flex-col overflow-hidden py-4 gap-4 animate-fade-in">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            {/* Header / Stats */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 flex-wrap gap-4">
              <div className="flex gap-4">
                <div className="bg-purple-50 border border-purple-100 rounded-lg px-3 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-purple-600">Total Confirmed</span>
                  <div className="text-lg font-black text-purple-700">
                    {reservations.filter(r => r.status === 'CONFIRMED').length}
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-600">Pending Pay</span>
                  <div className="text-lg font-black text-amber-700">
                    {reservations.filter(r => r.status === 'PENDING_PAYMENT').length}
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-600">Seated</span>
                  <div className="text-lg font-black text-emerald-700">
                    {reservations.filter(r => r.status === 'SEATED').length}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center flex-wrap">
                {/* Filters */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Status:</span>
                  <select 
                    value={resStatusFilter} 
                    onChange={e => setResStatusFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="PENDING_PAYMENT">Pending Payment</option>
                    <option value="SEATED">Seated</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-semibold">Date:</span>
                  <input 
                    type="date"
                    value={resDateFilter}
                    onChange={e => setResDateFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold focus:ring-1 focus:ring-teal-500 focus:outline-none bg-white"
                  />
                  {resDateFilter && (
                    <button 
                      onClick={() => setResDateFilter('')}
                      className="text-xs text-red-500 hover:text-red-700 font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <Button 
                  onClick={() => setReservationModalOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1 text-xs py-2 px-3 rounded-lg h-9 ml-4 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Book Table
                </Button>
              </div>
            </div>

            {/* List Table */}
            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Res ID</th>
                    <th className="py-3 px-4">Table</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Fee</th>
                    <th className="py-3 px-4">Pay Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {reservations
                    .filter(r => {
                      if (resStatusFilter !== 'ALL' && r.status !== resStatusFilter) return false;
                      if (resDateFilter) {
                        const rDate = new Date(r.reserveTime).toISOString().split('T')[0];
                        if (rDate !== resDateFilter) return false;
                      }
                      return true;
                    })
                    .map(r => {
                      const table = currentTables.find(t => t.id === r.tableId);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-semibold text-gray-500">{r.id.slice(0, 8)}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">T{r.tableNumber}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-gray-800">{r.customerName}</div>
                            <div className="text-[10px] text-gray-400">{r.phone || r.email || 'No contact info'}</div>
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-medium">
                            {new Date(r.reserveTime).toLocaleDateString()} {new Date(r.reserveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-gray-900">₹{r.amount}</td>
                          <td className="py-3 px-4 font-semibold text-gray-500">{r.paymentMethod}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              r.status === 'CONFIRMED' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                              r.status === 'PENDING_PAYMENT' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' :
                              r.status === 'SEATED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2 justify-center">
                              {r.status === 'CONFIRMED' && table && (
                                <button
                                  onClick={() => handleSeatCustomer(r, table)}
                                  className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1"
                                >
                                  <Check className="w-3 h-3" /> Seat Customer
                                </button>
                              )}
                              {r.status === 'PENDING_PAYMENT' && table && (
                                <button
                                  onClick={() => handlePaymentCheckout(r, table)}
                                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                                  disabled={resLoading}
                                >
                                  {resLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                                  <CreditCard className="w-3 h-3" /> Pay Now
                                </button>
                              )}
                              {(r.status === 'CONFIRMED' || r.status === 'PENDING_PAYMENT') && (
                                <button
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to cancel this reservation?")) {
                                      const updated = reservations.map(res => 
                                        res.id === r.id ? { ...res, status: 'CANCELLED' as const } : res
                                      );
                                      saveReservations(updated);
                                      if (table) {
                                        saveTableLocal({ ...table, status: 'AVAILABLE' as const });
                                        tableService.updateStatus(table.id, 'AVAILABLE').catch(console.error);
                                      }
                                      qc.invalidateQueries({ queryKey: ['floors'] });
                                    }
                                  }}
                                  className="px-2.5 py-1 rounded border border-red-200 hover:bg-red-50 text-red-600 font-bold text-[10px]"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <FloorFormModal open={floorForm} onClose={() => setFloorForm(false)} initial={editFloor} />
      
      <TableFormModal
        open={tableForm.open}
        onClose={() => setTableForm({ open: false, floorId: '' })}
        floorId={tableForm.floorId}
        initial={tableForm.table}
        nextTableNumber={(localTables[tableForm.floorId] || []).reduce((max, t) => Math.max(max, t.tableNumber), 0) + 1}
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

      {/* New Reservation Modal */}
      <Modal 
        open={reservationModalOpen} 
        onClose={() => { setReservationModalOpen(false); clearReservationForm(); }} 
        title="New Reservation Booking" 
        size="md"
      >
        <form onSubmit={handleCreateReservationSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                label="Customer Name *" 
                value={newResName} 
                onChange={e => setNewResName(e.target.value)} 
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <Input 
                label="Phone Number" 
                value={newResPhone} 
                onChange={e => setNewResPhone(e.target.value)} 
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                label="Email Address" 
                value={newResEmail} 
                onChange={e => setNewResEmail(e.target.value)} 
                placeholder="e.g. john@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Select Table *
              </label>
              <select
                value={newResTableId}
                onChange={e => setNewResTableId(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-teal-500 focus:border-teal-500 bg-white"
                required
              >
                <option value="">-- Choose Vacant Table --</option>
                {currentTables
                  .filter(t => !t.isOutOfService && t.status !== 'OCCUPIED' && t.status !== 'RESERVED' && !getTableReservation(t.id))
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      Table T{t.tableNumber} ({t.numberOfSeats} Seats)
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input 
                label="Reservation Date & Time *" 
                type="datetime-local" 
                value={newResTime} 
                onChange={e => setNewResTime(e.target.value)} 
                required
              />
            </div>
            <div>
              <Input 
                label="Reservation Fee (₹) *" 
                type="number" 
                value={newResAmount} 
                onChange={e => setNewResAmount(Number(e.target.value))} 
                required
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['CASH', 'CARD', 'UPI'] as const).map(pm => (
                <button
                  type="button"
                  key={pm}
                  onClick={() => setNewResPayMethod(pm)}
                  className={`py-2 px-3 border rounded-lg text-xs font-semibold transition-all ${
                    newResPayMethod === pm 
                      ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm' 
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="online-pay-checkbox"
              checked={newResIsOnline}
              onChange={e => setNewResIsOnline(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="online-pay-checkbox" className="text-xs font-semibold text-gray-700 select-none flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-teal-600" />
              Pay Online Immediately (Razorpay Checkout)
            </label>
          </div>

          <div className="flex gap-2 justify-end mt-6">
            <Button 
              type="button"
              variant="outline" 
              onClick={() => { setReservationModalOpen(false); clearReservationForm(); }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              isLoading={resLoading}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>

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
            const updatedTable = { ...table, status: 'OCCUPIED' as const };
            saveTableLocal(updatedTable);
            qc.invalidateQueries({ queryKey: ['floors'] });

            // 3. Make sure table is synced to backend
            let activeTable = table;
            if (table.id.startsWith('t_')) {
              const dbTable = await tableService.create({
                floorId: table.floorId,
                tableNumber: table.tableNumber,
                numberOfSeats: table.numberOfSeats,
                isOutOfService: table.isOutOfService,
                x: table.x,
                y: table.y,
                width: table.width,
                height: table.height,
                shape: table.shape
              });
              const createdTable = Array.isArray(dbTable) ? dbTable[0] : dbTable;
              if (createdTable && createdTable.id) {
                activeTable = { ...table, id: createdTable.id };
              }
            }
            setSelectedTable(activeTable);
            navigate(ROUTES.POS);
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
            const updatedTable = { ...table, status: 'OCCUPIED' as const };
            saveTableLocal(updatedTable);
            qc.invalidateQueries({ queryKey: ['floors'] });

            let activeTable = table;
            if (table.id.startsWith('t_')) {
              const dbTable = await tableService.create({
                floorId: table.floorId,
                tableNumber: table.tableNumber,
                numberOfSeats: table.numberOfSeats,
                isOutOfService: table.isOutOfService,
                x: table.x,
                y: table.y,
                width: table.width,
                height: table.height,
                shape: table.shape
              });
              const createdTable = Array.isArray(dbTable) ? dbTable[0] : dbTable;
              if (createdTable && createdTable.id) {
                activeTable = { ...table, id: createdTable.id };
              }
            }
            setSelectedTable(activeTable);
            navigate(ROUTES.POS);
          } catch (e: any) {
            console.error("Failed to skip and assign table:", e);
          }
        }}
      />
    </div>
  );
};