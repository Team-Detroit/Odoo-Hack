import React, { useState, useEffect } from 'react';
import { useSocket } from '../../hooks/useSocket';

type DisplayState = 'idle' | 'order' | 'payment' | 'complete';

interface OrderData { items: { name: string; qty: number; price: number }[]; subtotal: number; tax: number; discount: number; total: number; }
interface PaymentData { method: string; total: number; upiId?: string; }

export const CustomerDisplay: React.FC = () => {
  const socket = useSocket();
  const [state, setState] = useState<DisplayState>('idle');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    socket.on('display:order', (data) => { setOrderData(data as OrderData); setState('order'); });
    socket.on('display:payment', (data) => { setPaymentData(data as PaymentData); setState('payment'); });
    socket.on('display:complete', () => setState('complete'));
    socket.on('display:idle', () => { setState('idle'); setOrderData(null); setPaymentData(null); });
    return () => {
      socket.off('display:order');
      socket.off('display:payment');
      socket.off('display:complete');
      socket.off('display:idle');
    };
  }, [socket]);

  // Demo: cycle through states for preview
  const mockOrder: OrderData = { items: [{ name: 'Coffee', qty: 2, price: 100 }, { name: 'Samosa', qty: 1, price: 40 }], subtotal: 240, tax: 12, discount: 0, total: 252 };

  if (state === 'idle') return (
    <div className="min-h-screen bg-teal-700 flex flex-col items-center justify-center text-white">
      <div className="text-6xl mb-4">☕</div>
      <h1 className="text-4xl font-bold mb-2">Odoo Cafe</h1>
      <p className="text-teal-200 text-lg">Welcome! Your order will appear here.</p>
      <button onClick={() => { setOrderData(mockOrder); setState('order'); }} className="mt-8 px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">Demo: Show Order</button>
    </div>
  );

  if (state === 'order' && orderData) return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-teal-700 text-white px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">🧾</span>
        <h2 className="text-xl font-bold">Your Order</h2>
      </div>
      <div className="flex-1 p-6 max-w-lg mx-auto w-full">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Item</th>
              <th className="px-4 py-3 text-center text-xs text-gray-500">Qty</th>
              <th className="px-4 py-3 text-right text-xs text-gray-500">Price</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-100">
              {orderData.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-center">{item.qty}</td>
                  <td className="px-4 py-3 text-right">₹{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t space-y-1 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{orderData.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{orderData.tax.toFixed(2)}</span></div>
            {orderData.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{orderData.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-teal-600">₹{orderData.total.toFixed(2)}</span></div>
          </div>
        </div>
        <button onClick={() => setState('payment')} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Demo: Go to Payment</button>
      </div>
    </div>
  );

  if (state === 'payment') return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-3">💳</div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Payment</h2>
        <p className="text-3xl font-bold text-teal-600 my-4">₹{paymentData?.total.toFixed(2) ?? mockOrder.total.toFixed(2)}</p>
        {paymentData?.method === 'upi' && (
          <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto mb-4 flex items-center justify-center text-gray-400">UPI QR</div>
        )}
        <p className="text-sm text-gray-500">Please complete your payment at the counter.</p>
        <button onClick={() => setState('complete')} className="mt-4 w-full py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">Demo: Payment Done</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-teal-700 flex flex-col items-center justify-center text-white">
      <div className="text-6xl mb-4">✅</div>
      <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
      <p className="text-teal-200">Your order has been paid. Enjoy your meal!</p>
      <button onClick={() => setState('idle')} className="mt-8 px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30">Reset</button>
    </div>
  );
};
