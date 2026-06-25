import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { tableService } from '../../services/tableService';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { 
  Search, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  CheckCircle2, 
  User, 
  Armchair, 
  AlertCircle,
  TrendingDown,
  Clock,
  Check,
  ChevronRight,
  X
} from 'lucide-react';

export const Payments: React.FC = () => {
  const qc = useQueryClient();
  const { data: orders = [], isLoading, refetch } = useQuery({ 
    queryKey: ['orders'], 
    queryFn: orderService.mockGetBySession 
  });
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'paid'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD' | 'UPI'>('CASH');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  // Collect Payment mutation
  const collectPaymentMutation = useMutation({
    mutationFn: async ({ orderId, method, amount }: { orderId: string; method: string; amount: number }) => {
      // 1. Create Payment record in DB
      await orderService.createPayment({ orderId, method, amount });
      // 2. Update Order status to PAID and set paymentTag
      await orderService.update(orderId, {
        status: 'PAID' as any,
        paymentTag: `${method} Paid`
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] });
      qc.invalidateQueries({ queryKey: ['floors'] });
      setPaymentSuccessMsg('Payment successfully collected!');
      setTimeout(() => {
        setPaymentSuccessMsg('');
        setSelectedOrder(null);
      }, 2000);
    },
    onError: (err: any) => {
      alert("Failed to collect payment: " + (err.response?.data?.message || err.message));
    }
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  // Filter orders by tab
  const tabOrders = orders.filter(o => {
    const isPaid = o.status?.toUpperCase() === 'PAID';
    if (activeTab === 'pending') {
      return !isPaid;
    } else {
      return isPaid;
    }
  });

  // Filter orders by search
  const filtered = tabOrders.filter(o => {
    const orderNo = o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`;
    return !search || orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      (o.table && `t${o.table.tableNumber ?? o.table.number}`.includes(search.toLowerCase()));
  });

  // Calculate unpaid totals
  const unpaidOrders = orders.filter(o => o.status?.toUpperCase() !== 'PAID');
  const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + o.total, 0);

  const handleCollectPaymentClick = (order: any) => {
    setSelectedOrder(order);
    setPaymentMethod('CASH');
  };

  const handleConfirmPayment = () => {
    if (!selectedOrder) return;
    collectPaymentMutation.mutate({
      orderId: selectedOrder.id,
      method: paymentMethod,
      amount: selectedOrder.total
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      {/* Header and counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Payment Collection</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage and record cashier payments for table kiosk orders</p>
        </div>

        {/* Counter Widget */}
        <div className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_#000] flex items-center gap-4 min-w-[240px]">
          <div className="w-10 h-10 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400">Total Pending Collection</p>
            <p className="text-xl font-black text-gray-800 mt-0.5">₹{totalUnpaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Tabs and search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-xs font-black rounded-lg border-2 transition-all cursor-pointer flex items-center gap-1.5
              ${activeTab === 'pending'
                ? 'bg-odoo-purple text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Collections ({unpaidOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`px-4 py-2 text-xs font-black rounded-lg border-2 transition-all cursor-pointer flex items-center gap-1.5
              ${activeTab === 'paid'
                ? 'bg-odoo-purple text-white border-black shadow-[2px_2px_0px_#000]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-black'}`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Paid History
          </button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search #, customer, table…"
            className="w-full pl-9 pr-3 py-2 text-xs border-2 border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-purple font-medium"
          />
        </div>
      </div>

      {/* Orders Grid */}
      {filtered.length === 0 ? (
        <EmptyState title={`No ${activeTab === 'pending' ? 'pending' : 'paid'} orders found`} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(o => {
            const isSelf = o.selfOrder;
            const orderNo = o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`;
            const dateStr = new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date(o.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' });

            return (
              <div 
                key={o.id}
                className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] p-4 flex flex-col justify-between hover:scale-[1.01] transition-transform"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs font-black text-gray-800 bg-gray-50 border border-gray-250 px-2 py-0.5 rounded">
                      {orderNo}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {dateStr}
                    </span>
                  </div>

                  {/* Customer and Table */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      <span>{o.customer?.name || 'Walk-in Customer'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
                      <Armchair className="w-3.5 h-3.5 text-gray-400" />
                      <span>{o.table ? `Table T${o.table.tableNumber ?? o.table.number}` : 'Takeaway'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {isSelf && (
                      <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Smartphone className="w-2.5 h-2.5" /> Self-Order
                      </span>
                    )}
                    <span className={`px-1.5 py-0.5 border rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${
                      activeTab === 'paid' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {o.status}
                    </span>
                    {o.paymentTag && (
                      <span className={`px-1.5 py-0.5 border rounded text-[9px] font-black uppercase tracking-wider shadow-sm ${
                        o.paymentTag.toLowerCase().includes('paid')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {o.paymentTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-150 pt-3 flex justify-between items-center mt-2">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Total Amount</span>
                    <span className="text-sm font-black text-gray-800">₹{o.total.toFixed(2)}</span>
                  </div>
                  
                  {activeTab === 'pending' ? (
                    <button
                      onClick={() => handleCollectPaymentClick(o)}
                      className="px-3.5 py-2 bg-odoo-teal hover:bg-[#00b0ad] text-white border-2 border-black rounded-xl font-black text-xs shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      Collect Payment <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Paid
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collect Payment Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[340px] bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] p-5 flex flex-col gap-4 animate-scale-up">
            
            {paymentSuccessMsg ? (
              <div className="py-6 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-black flex items-center justify-center text-emerald-600 shadow animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-gray-850">{paymentSuccessMsg}</h4>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-gray-850">Record Payment</h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">Order {selectedOrder.orderNumber || `#${selectedOrder.id.substring(0, 8).toUpperCase()}`}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 rounded-full hover:bg-gray-105 border border-transparent hover:border-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Amount details */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Amount Due:</span>
                  <span className="text-base font-black text-gray-800">₹{selectedOrder.total.toFixed(2)}</span>
                </div>

                {/* Selection */}
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2">Select Payment Method</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'CASH', label: 'Cash', icon: Banknote },
                      { id: 'CARD', label: 'Card', icon: CreditCard },
                      { id: 'UPI', label: 'UPI', icon: Smartphone }
                    ].map(method => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`py-2 px-1 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer
                            ${isSelected 
                              ? 'bg-odoo-purple text-white border-black shadow-[2px_2px_0px_#000]' 
                              : 'bg-white text-gray-700 border-gray-250 hover:border-black'}`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px] font-black">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Confirm button */}
                <div className="flex gap-2.5 mt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    disabled={collectPaymentMutation.isPending}
                    className="flex-1 py-2.5 text-xs font-black rounded-xl border-2 border-black bg-white hover:bg-gray-100 text-gray-800 shadow-[2px_2px_0px_#000] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={collectPaymentMutation.isPending}
                    className="flex-1 py-2.5 text-xs font-black rounded-xl border-2 border-black bg-odoo-purple text-white hover:bg-opacity-90 shadow-[2px_2px_0px_#000] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {collectPaymentMutation.isPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Recording...
                      </>
                    ) : (
                      'Record Paid'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
