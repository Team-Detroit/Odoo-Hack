import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatCurrency } from '../../utils/formatCurrency';

export const SelfOrderMenu: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<'menu' | 'cart' | 'status'>('menu');

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'menu' && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-600 mb-4">☕ Odoo Cafe</h1>
            <Input type="text" placeholder="Search menu..." className="max-w-md" />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto">
            <Button variant="primary" size="sm">All Items</Button>
            <Button variant="secondary" size="sm">Beverages</Button>
            <Button variant="secondary" size="sm">Appetizers</Button>
            <Button variant="secondary" size="sm">Main Course</Button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Coffee</h3>
                <p className="text-gray-600 text-sm mb-3">Hot freshly brewed coffee</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-teal-600">{formatCurrency(100)}</span>
                  <Button size="sm" onClick={() => setCartItems([...cartItems, { name: 'Coffee', price: 100 }])}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Cart Button */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-8 right-8">
              <Button
                className="text-lg py-4 px-8"
                onClick={() => setCurrentStep('cart')}
              >
                View Cart ({cartItems.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {currentStep === 'cart' && (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button
            variant="secondary"
            onClick={() => setCurrentStep('menu')}
            className="mb-6"
          >
            ← Continue Shopping
          </Button>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Your Order</h2>

            <div className="space-y-3 mb-6">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center border-b pb-3">
                  <span>{item.name}</span>
                  <span className="font-semibold">{formatCurrency(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="text-right text-2xl font-bold mb-6">
              Total: {formatCurrency(cartItems.reduce((sum, item) => sum + item.price, 0))}
            </div>

            <Input
              label="Coupon Code (Optional)"
              placeholder="Enter code"
              className="mb-6"
            />

            <Button
              className="w-full text-lg py-3"
              onClick={() => setCurrentStep('status')}
            >
              Place Order
            </Button>
          </div>
        </div>
      )}

      {currentStep === 'status' && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Your Order is Placed!</h1>
            <p className="text-gray-600 mb-8">Order #12345</p>

            <div className="bg-white rounded-lg shadow p-8 max-w-md">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">⏳</div>
                  <div>
                    <p className="font-semibold">To Cook</p>
                    <p className="text-sm text-gray-600">Currently cooking your order</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="mt-8"
              onClick={() => {
                setCurrentStep('menu');
                setCartItems([]);
              }}
            >
              Place Another Order
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
