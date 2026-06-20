import React, { useState } from 'react';
import { Toggle } from '../../components/common/Toggle';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const PaymentMethods: React.FC = () => {
  const [cash, setCash] = useState(true);
  const [card, setCard] = useState(true);
  const [upi, setUpi] = useState(true);
  const [upiId, setUpiId] = useState('cafe@ybl');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payment Methods</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Cash Payment</h3>
            <p className="text-gray-600 text-sm">Accept cash payments</p>
          </div>
          <Toggle checked={cash} onChange={setCash} />
        </div>

        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Card Payment</h3>
            <p className="text-gray-600 text-sm">Accept card/digital payments</p>
          </div>
          <Toggle checked={card} onChange={setCard} />
        </div>

        <div className="pb-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold text-lg">UPI Payment</h3>
              <p className="text-gray-600 text-sm">Accept UPI/QR payments</p>
            </div>
            <Toggle checked={upi} onChange={setUpi} />
          </div>

          {upi && (
            <div className="mt-4 pl-4 border-l-2 border-teal-600">
              <Input
                label="UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="cafe@ybl"
              />
            </div>
          )}
        </div>

        <Button className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};
