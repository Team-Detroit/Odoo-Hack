import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';

export const Orders: React.FC = () => {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: orderService.mockGetBySession });
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const orderNo = o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`;
    return !search || orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase());
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Orders</h2>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search order # or customer…"
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      {filtered.length === 0 ? <EmptyState title="No orders found" /> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Order #','Customer','Table','Total','Status','Date'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><Link to={`/pos/orders/${o.id}`} className="font-mono font-semibold text-teal-600 hover:underline">{o.orderNumber || `#${o.id.substring(0, 8).toUpperCase()}`}</Link></td>
                  <td className="px-4 py-3 text-gray-600">{o.customer?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{o.table ? `T${o.table.tableNumber ?? o.table.number}` : '—'}</td>
                  <td className="px-4 py-3 font-semibold">₹{o.total.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs font-medium ${ORDER_STATUS_COLORS[o.status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>{ORDER_STATUS_LABELS[o.status.toLowerCase()] || o.status}</span></td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
