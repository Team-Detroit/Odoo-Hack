import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentMethodService } from '../../services/paymentMethodService';
import { PaymentMethod } from '../../types/paymentMethod';
import { Toggle } from '../../components/common/Toggle';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { 
  Banknote, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  Wifi 
} from 'lucide-react';

export const PaymentMethods: React.FC = () => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['paymentMethods'], queryFn: paymentMethodService.mockGetAll });
  
  // Find specific methods
  const cashMethod = data.find(m => m.type === 'cash');
  const cardMethod = data.find(m => m.type === 'card');
  const upiMethod = data.find(m => m.type === 'upi');

  const [upiInputs, setUpiInputs] = useState<Record<string, string>>({});

  const toggle = useMutation({
    mutationFn: (m: PaymentMethod) => paymentMethodService.update({ type: m.type, isEnabled: !m.isEnabled, upiId: m.upiId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paymentMethods'] }),
  });

  const saveUpi = useMutation({
    mutationFn: (m: PaymentMethod) => paymentMethodService.update({ type: m.type, isEnabled: m.isEnabled, upiId: upiInputs[m.id] }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['paymentMethods'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
          <p className="text-sm text-gray-500 mt-1">Configure how your customers pay for their orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-gray-300">Discard</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left / Middle: Configuration Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Cash Payment Card */}
          {cashMethod && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl border border-green-100">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Cash Payment</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                      Accept physical currency at the register. Ideal for fast transactions without processing fees.
                    </p>
                  </div>
                </div>
                <Toggle checked={cashMethod.isEnabled} onChange={() => toggle.mutate(cashMethod)} />
              </div>
              <div className="mt-5 pt-4 border-t border-gray-150 flex items-center">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                  cashMethod.isEnabled 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {cashMethod.isEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          )}

          {/* Digital & Card Card */}
          {cardMethod && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 text-odoo-purple rounded-xl border border-purple-100">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">Digital & Card</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                      Enable integrated card terminals for Credit, Debit, and NFC payments like Apple Pay and Google Pay.
                    </p>
                  </div>
                </div>
                <Toggle checked={cardMethod.isEnabled} onChange={() => toggle.mutate(cardMethod)} />
              </div>
              <div className="mt-5 pt-4 border-t border-gray-150 flex items-center gap-3 text-gray-400">
                <Wifi className="w-4 h-4" />
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold text-gray-500">Terminal Connected</span>
              </div>
            </div>
          )}

          {/* UPI QR Payment Card */}
          {upiMethod && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-50 text-odoo-teal rounded-xl border border-teal-100">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">UPI QR Payment</h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                      Direct bank transfers via UPI. Customers can scan a static QR code generated from your UPI ID.
                    </p>
                  </div>
                </div>
                <Toggle checked={upiMethod.isEnabled} onChange={() => toggle.mutate(upiMethod)} />
              </div>

              {upiMethod.isEnabled && (
                <div className="mt-6 pt-5 border-t border-gray-150 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      label="VIRTUAL PAYMENT ADDRESS (UPI ID)"
                      placeholder="e.g. cafe@ybl"
                      value={upiInputs[upiMethod.id] ?? upiMethod.upiId ?? ''}
                      onChange={e => setUpiInputs(p => ({ ...p, [upiMethod.id]: e.target.value }))}
                    />
                    <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600">
                      <ShieldCheck className="w-4.5 h-4.5 text-odoo-teal shrink-0" />
                      <span>Ensure your UPI ID is linked to your business account to avoid transaction limits.</span>
                    </div>
                    <Button size="sm" onClick={() => saveUpi.mutate(upiMethod)} isLoading={saveUpi.isPending}>
                      Save Address
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center border border-dashed border-gray-350 rounded-2xl p-4 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Preview for:</p>
                    <p className="text-sm font-semibold text-odoo-teal mb-3">{upiMethod.upiId || upiInputs[upiMethod.id] || 'Not Configured'}</p>
                    
                    <div className="w-32 h-32 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm relative">
                      <Smartphone className="w-16 h-16 text-gray-300" />
                    </div>

                    <button className="mt-4 flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-odoo-purple hover:underline cursor-pointer">
                      <Printer className="w-3.5 h-3.5" /> Print QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar: Active Summary */}
        <div className="space-y-6">
          <div className="bg-odoo-purple text-white rounded-2xl p-6 shadow-md flex flex-col justify-between h-72">
            <div>
              <h3 className="text-lg font-bold">Active Methods</h3>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>Cash Payment</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>Cards & Digital</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm font-medium">
                  <CheckCircle2 className="w-5 h-5 text-green-300" />
                  <span>UPI QR</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 text-xs">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-teal-300">Fee Optimization</p>
              <p className="mt-1.5 font-medium leading-relaxed">
                Currently saving ~2.4% on fees using UPI-first routing.
              </p>
            </div>
          </div>

          {/* Certified Integrations */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Certified Integrations</p>
            <div className="grid grid-cols-4 gap-3">
              {['Visa', 'MC', 'Rupay', 'UPI'].map((item, idx) => (
                <div key={idx} className="h-10 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-400 select-none shadow-inner">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
