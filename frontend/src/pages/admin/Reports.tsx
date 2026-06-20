import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../../services/reportService';
import { ReportFilter } from '../../types/report';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';

const MetricCard: React.FC<{ label: string; value: string; icon: string }> = ({ label, value, icon }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </div>
);

const PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom', value: 'custom' },
] as const;

export const Reports: React.FC = () => {
  const [filter, setFilter] = useState<ReportFilter>({ period: 'today' });
  const { data, isLoading } = useQuery({ queryKey: ['report', filter], queryFn: reportService.mockGetReport });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Reports</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">⬇ Export PDF</Button>
          <Button variant="outline" size="sm">⬇ Export XLS</Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex gap-3 flex-wrap items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Period</label>
          <div className="flex gap-1">
            {PERIODS.map(p => (
              <button key={p.value} onClick={() => setFilter(f => ({ ...f, period: p.value }))}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter.period === p.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {filter.period === 'custom' && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">From</label>
              <input type="date" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md" onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">To</label>
              <input type="date" className="px-3 py-1.5 text-sm border border-gray-300 rounded-md" onChange={e => setFilter(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : data ? (
        <div className="space-y-5">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Orders" value={String(data.metrics.totalOrders)} icon="🧾" />
            <MetricCard label="Revenue" value={`₹${data.metrics.totalRevenue.toLocaleString()}`} icon="💰" />
            <MetricCard label="Avg Order Value" value={`₹${data.metrics.averageOrderValue.toFixed(0)}`} icon="📊" />
            <MetricCard label="Customers" value={String(data.metrics.totalCustomers)} icon="👥" />
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Top Products</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Product</th><th className="px-4 py-2 text-right text-xs text-gray-500">Qty</th><th className="px-4 py-2 text-right text-xs text-gray-500">Sales</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.topProducts.map(p => (
                  <tr key={p.productId} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{p.productName}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{p.quantity}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{p.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Categories */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Top Categories</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Category</th><th className="px-4 py-2 text-right text-xs text-gray-500">Qty</th><th className="px-4 py-2 text-right text-xs text-gray-500">Sales</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.topCategories.map(c => (
                  <tr key={c.categoryId} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-medium">{c.categoryName}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{c.quantity}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{c.totalSales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Orders */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-700">Top Orders</h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left text-xs text-gray-500">Order</th><th className="px-4 py-2 text-right text-xs text-gray-500">Items</th><th className="px-4 py-2 text-right text-xs text-gray-500">Total</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {data.topOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-mono font-medium">{o.orderNumber}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{o.itemCount}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-teal-600">₹{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};
