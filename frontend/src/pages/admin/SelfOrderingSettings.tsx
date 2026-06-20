import React, { useState } from 'react';
import { Toggle } from '../../components/common/Toggle';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

export const SelfOrderingSettings: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [mode, setMode] = useState('online');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Self Ordering Configuration</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Enable Self Ordering</h3>
            <p className="text-gray-600 text-sm">Allow customers to place orders via QR code</p>
          </div>
          <Toggle checked={isEnabled} onChange={setIsEnabled} />
        </div>

        {isEnabled && (
          <>
            <div>
              <Select
                label="Ordering Mode"
                options={[
                  { value: 'online', label: 'Online Ordering' },
                  { value: 'qr-only', label: 'QR Menu Only' },
                ]}
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              />
              <p className="text-sm text-gray-600 mt-2">
                Online: Customers can browse and place orders
                <br />
                QR Menu Only: Browse menu only, staff takes orders
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                defaultValue="#f5f5f5"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-900 mb-2">Table QR Codes</h4>
              <p className="text-sm text-blue-700 mb-4">Generate and download QR codes for each table</p>
              <Button>Generate QR Codes for All Tables</Button>
            </div>
          </>
        )}

        <Button className="w-full">Save Settings</Button>
      </div>
    </div>
  );
};
