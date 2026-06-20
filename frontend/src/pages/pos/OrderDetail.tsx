import React from 'react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export const OrderDetail: React.FC = () => {
  const order = null;

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Order Header */}
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Order Number</p>
            <p className="font-semibold">ORD-001</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date</p>
            <p className="font-semibold">Today</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Customer</p>
            <p className="font-semibold">Raj Kumar</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <Badge text="Paid" variant="success" />
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="font-semibold mb-3">Items</h3>
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Unit Price</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">Biryani</td>
                <td className="px-4 py-2">2</td>
                <td className="px-4 py-2">₹300</td>
                <td className="px-4 py-2">₹600</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-80">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹600</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹60</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-₹0</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹660</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="secondary">Print Receipt</Button>
          <Button variant="secondary">Email Receipt</Button>
          <Button variant="danger">Delete Order</Button>
        </div>
      </div>
    </div>
  );
};
