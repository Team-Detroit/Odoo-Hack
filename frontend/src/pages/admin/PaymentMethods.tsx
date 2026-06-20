import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodService } from '../../services/paymentMethodService';
import { PaymentMethod } from '../../types/paymentMethod';
import { Toggle } from '../../components/common/Toggle';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';

const METHOD_ICONS: Record<string, string> = { cash: '💵', card: '💳', upi: '📱' };
const METHOD_LABELS: Record<string, string> = { cash: 'Cash', card: 'Card / Digital', upi: 'UPI QR' };

export const PaymentMethods: React.FC = () => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['paymentMethods'], queryFn: paymentMethodService.mockGetAll });
  const [upiInputs, setUpiInputs] = useState<Record<string, string>>({});

  const toggle = useMutation({
    mutationFn: (m: PaymentMethod) => paymentMethodService.update({ type: m.type, isEnabled: !m.isEnabled, upiId: m.upiId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paymentMethods'] }),
  });

  const saveUpi = useMutation({
    mutationFn: (m: PaymentMethod) => paymentMethodService.update({ type: m.type, isEnabled: m.isEnabled, upiId: upiInputs[m.id] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paymentMethods'] }),
  });

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Payment Methods</h2>
      <div className="space-y-4 max-w-xl">
        {data.map((m) => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{METHOD_ICONS[m.type]}</span>
                <div>
                  <p className="font-medium text-gray-800">{METHOD_LABELS[m.type]}</p>
                  <p className="text-xs text-gray-400">{m.isEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
              <Toggle checked={m.isEnabled} onChange={() => toggle.mutate(m)} />
            </div>
            {m.type === 'upi' && m.isEnabled && (
              <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="UPI ID e.g. cafe@ybl"
                    value={upiInputs[m.id] ?? m.upiId ?? ''}
                    onChange={e => setUpiInputs(p => ({ ...p, [m.id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => saveUpi.mutate(m)} isLoading={saveUpi.isPending}>Save</Button>
                </div>
                {(m.upiId || upiInputs[m.id]) && (
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">QR Preview</p>
                    <div className="w-32 h-32 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400 text-center p-2">
                      UPI: {m.upiId || upiInputs[m.id]}
                    </div>
                    <p className="text-xs text-gray-400">{m.upiId || upiInputs[m.id]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
