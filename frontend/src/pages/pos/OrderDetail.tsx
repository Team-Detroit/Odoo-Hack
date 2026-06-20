import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../services/orderService';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants/orderStatus';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { ROUTES } from '../../constants/routes';

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [delOpen, setDelOpen] = React.useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id!),
    enabled: !!id,
  });

  const remove = useMutation({
    mutationFn: () => orderService.delete(id!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['orders'] }); navigate(ROUTES.POS_ORDERS); },
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;
  if (!order) return <div className="p-6 text-gray-500">Order not found</div>;

  const isDraft = (order.status || '').toLowerCase() === 'draft';
  const displayStatus = (order.status || '').toLowerCase();
  const displayOrderNo = order.orderNumber || `#${order.id.substring(0, 8).toUpperCase()}`;

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">←</button>
        <h2 className="text-lg font-semibold text-gray-800">Order {displayOrderNo}</h2>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${ORDER_STATUS_COLORS[displayStatus] || 'bg-gray-100 text-gray-800'}`}>{ORDER_STATUS_LABELS[displayStatus] || order.status}</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="grid grid-cols-2 gap-px bg-gray-100">
          {[
            ['Date', new Date(order.createdAt).toLocaleString('en-IN')],
            ['Customer', order.customer?.name ?? '—'],
            ['Table', order.table ? `T${order.table.tableNumber ?? order.table.number}` : '—'],
            ['Session', order.sessionId],
          ].map(([k, v]) => (
            <div key={k} className="bg-white px-4 py-3">
              <p className="text-xs text-gray-400">{k}</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-sm text-gray-700">Items</h3>
        </div>
        {order.items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-gray-400 text-center">No items</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-2 text-left text-xs text-gray-500">Product</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500">Qty</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500">Price</th>
              <th className="px-4 py-2 text-right text-xs text-gray-500">Total</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map(item => (
                <tr key={item.id}>
                  <td className="px-4 py-2.5">{item.product?.name ?? 'Unknown Product'}</td>
                  <td className="px-4 py-2.5 text-right">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-right">₹{(item.price ?? item.unitPrice ?? 0).toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-right font-medium">₹{(item.total ?? item.lineTotal ?? 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4 py-3 border-t border-gray-100 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{order.tax.toFixed(2)}</span></div>
          {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{order.discount.toFixed(2)}</span></div>}
          <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
        </div>
      </div>

      {isDraft && (
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(ROUTES.POS)}>Edit Order</Button>
          <Button variant="danger" onClick={() => setDelOpen(true)}>Delete Order</Button>
        </div>
      )}

      <ConfirmDeleteModal open={delOpen} onClose={() => setDelOpen(false)} onConfirm={() => remove.mutate()} loading={remove.isPending} message={`Delete order ${displayOrderNo}?`} />
    </div>
  );
};
