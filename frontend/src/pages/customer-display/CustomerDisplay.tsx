import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatCurrency';

export const CustomerDisplay: React.FC = () => {
  const [displayState, setDisplayState] = useState<'order' | 'payment' | 'complete'>('order');

  return (
    <div className="h-screen bg-gradient-to-br from-teal-600 to-teal-800 text-white flex flex-col items-center justify-center p-8">
      {displayState === 'order' && (
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">Your Order</h1>
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 max-w-2xl w-full">
            <table className="w-full mb-6">
              <tbody>
                <tr className="border-b border-white border-opacity-30">
                  <td className="py-3 text-left">Biryani</td>
                  <td className="py-3 text-right">2 x ₹300</td>
                </tr>
                <tr>
                  <td className="py-3 text-left">Raita</td>
                  <td className="py-3 text-right">1 x ₹50</td>
                </tr>
              </tbody>
            </table>
            <div className="text-3xl font-bold mb-8">Total: {formatCurrency(650)}</div>
            <Button
              className="w-full bg-white text-teal-600 hover:bg-gray-100 text-lg py-3"
              onClick={() => setDisplayState('payment')}
            >
              Proceed to Payment
            </Button>
          </div>
        </div>
      )}

      {displayState === 'payment' && (
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-8">Awaiting Payment</h1>
          <div className="text-5xl font-bold mb-8">{formatCurrency(650)}</div>
          <p className="text-2xl mb-8">Scanning payment...</p>
          <Button
            className="bg-white text-teal-600 hover:bg-gray-100 text-lg py-3 px-8"
            onClick={() => setDisplayState('complete')}
          >
            Complete Order
          </Button>
        </div>
      )}

      {displayState === 'complete' && (
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">✓ Payment Successful</h1>
          <p className="text-3xl mb-8">Thank you for your order!</p>
          <p className="text-xl opacity-75">Your order will be ready soon</p>
        </div>
      )}
    </div>
  );
};
