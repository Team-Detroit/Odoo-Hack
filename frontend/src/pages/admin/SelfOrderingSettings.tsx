import React, { useState } from 'react';
import { Toggle } from '../../components/common/Toggle';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';

export const SelfOrderingSettings: React.FC = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<'online' | 'qr_menu'>('online');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Self Ordering Settings</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Enable Self Ordering</p>
            <p className="text-xs text-gray-400 mt-0.5">Allow customers to order via QR code</p>
          </div>
          <Toggle checked={enabled} onChange={setEnabled} />
        </div>

        {enabled && (
          <>
            <div className="border-t border-gray-100 pt-4">
              <Select
                label="Mode"
                value={mode}
                onChange={e => setMode(e.target.value as 'online' | 'qr_menu')}
                options={[
                  { label: 'Online Ordering (browse + cart + place order)', value: 'online' },
                  { label: 'QR Menu Only (browse only, no cart)', value: 'qr_menu' },
                ]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer" />
                <Input value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-32" />
                <div className="w-10 h-10 rounded-lg border border-gray-200" style={{ backgroundColor: bgColor }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Table QR Codes</label>
              <p className="text-xs text-gray-400 mb-3">Each table gets a unique QR link: <code className="bg-gray-100 px-1 rounded">/s/{'<token>'}</code></p>
              <div className="grid grid-cols-3 gap-3">
                {['T1', 'T2', 'T3'].map(t => (
                  <div key={t} className="border border-gray-200 rounded-lg p-3 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center text-xs text-gray-400">QR</div>
                    <p className="text-xs font-medium">{t}</p>
                    <button className="text-xs text-teal-600 hover:underline mt-1">Download</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <Button onClick={save} isLoading={false}>{saved ? '✓ Saved!' : 'Save Settings'}</Button>
    </div>
  );
};
