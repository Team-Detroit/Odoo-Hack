import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';

export const OrderView: React.FC = () => {
  const [cartItems] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<any>(null);

  const subtotal = 0;
  const tax = 0;
  const discount = 0;
  const total = 0;

  return (
    <div className="flex h-full bg-gray-50 gap-4 p-4">
      {/* Product Section */}
      <div className="flex-1">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Category Tabs */}
          <div className="col-span-3 flex gap-2 mb-4">
            <Button size="sm" variant="primary">All</Button>
            <Button size="sm" variant="secondary">Beverages</Button>
            <Button size="sm" variant="secondary">Appetizers</Button>
          </div>

          {/* Product Grid */}
          <div className="col-span-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-full h-24 bg-gray-200 rounded mb-2"></div>
                <h4 className="font-medium">Coffee</h4>
                <p className="text-sm text-gray-600">₹100</p>
                <Button size="sm" className="w-full mt-2">Add to Cart</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cart & Payment Section */}
      <div className="w-80 flex flex-col gap-4">
        {/* Cart */}
        <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-auto">
          <h3 className="font-semibold mb-3 text-lg">
            {selectedTable ? `Table ${selectedTable.number}` : 'New Order'}
          </h3>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            <div className="space-y-2">
              {/* Cart items will go here */}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span>-{formatCurrency(discount)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full">Apply Coupon</Button>
            <Button className="w-full" variant="secondary">Assign Customer</Button>
            <Button className="w-full" variant="primary">Send to Kitchen</Button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="font-semibold mb-2 text-sm">Payment</h4>
          <div className="grid grid-cols-3 gap-2">
            <Button size="sm" variant="secondary">Cash</Button>
            <Button size="sm" variant="secondary">Card</Button>
            <Button size="sm" variant="secondary">UPI</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
