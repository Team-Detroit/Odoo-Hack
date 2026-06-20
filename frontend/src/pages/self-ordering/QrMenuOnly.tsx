import React from 'react';
import { Button } from '../../components/common/Button';

export const QrMenuOnly: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">☕ Odoo Cafe</h1>
          <p className="text-gray-600">Menu</p>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
            <h3 className="font-semibold mb-1">Coffee</h3>
            <p className="text-sm text-gray-600 mb-2">₹100</p>
            <p className="text-xs text-gray-500">Ask staff to order</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
            <h3 className="font-semibold mb-1">Tea</h3>
            <p className="text-sm text-gray-600 mb-2">₹80</p>
            <p className="text-xs text-gray-500">Ask staff to order</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            Please call staff to place your order
          </p>
          <Button variant="secondary" className="mt-4">
            Call Staff
          </Button>
        </div>
      </div>
    </div>
  );
};
