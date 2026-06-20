import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { couponService } from '../../services/couponService';
import { promotionService } from '../../services/promotionService';
import { Coupon, CreateCouponRequest } from '../../types/coupon';
import { Promotion, CreatePromotionRequest } from '../../types/promotion';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { 
  Ticket, 
  TrendingUp, 
  PiggyBank, 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  RotateCcw 
} from 'lucide-react';

const CouponFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Coupon }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateCouponRequest>({ code: '', discountType: 'percentage', discountValue: 0 });
  React.useEffect(() => { if (initial) setForm({ code: initial.code, discountType: initial.discountType, discountValue: initial.discountValue }); else setForm({ code: '', discountType: 'percentage', discountValue: 0 }); }, [initial, open]);
  const save = useMutation({ mutationFn: () => initial ? couponService.update(initial.id, form) : couponService.create(form), onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); onClose(); } });
  const set = (k: keyof CreateCouponRequest, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Coupon' : 'New Coupon'} size="sm">
      <div className="space-y-3">
        <Input label="Coupon Code" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="e.g. WELCOME10" />
        <Select label="Discount Type" value={form.discountType} onChange={e => set('discountType', e.target.value)} options={[{ label: 'Percentage (%)', value: 'percentage' }, { label: 'Fixed (₹)', value: 'fixed' }]} />
        <Input label={`Discount Value (${form.discountType === 'percentage' ? '%' : '₹'})`} type="number" value={form.discountValue} onChange={e => set('discountValue', Number(e.target.value))} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

const PromotionFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Promotion }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreatePromotionRequest>({ name: '', type: 'order', discountType: 'percentage', discountValue: 0 });
  React.useEffect(() => { if (initial) setForm({ name: initial.name, type: initial.type, discountType: initial.discountType, discountValue: initial.discountValue, productId: initial.productId, minProductQuantity: initial.minProductQuantity, minOrderAmount: initial.minOrderAmount }); else setForm({ name: '', type: 'order', discountType: 'percentage', discountValue: 0 }); }, [initial, open]);
  const save = useMutation({ mutationFn: () => initial ? promotionService.update(initial.id, form) : promotionService.create(form), onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); onClose(); } });
  const set = (k: keyof CreatePromotionRequest, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Promotion' : 'New Promotion'} size="md">
      <div className="space-y-3">
        <Input label="Promotion Name" value={form.name} onChange={e => set('name', e.target.value)} />
        <Select label="Type" value={form.type} onChange={e => set('type', e.target.value)} options={[{ label: 'Order-based (min order amount)', value: 'order' }, { label: 'Product-based (min product qty)', value: 'product' }]} />
        <Select label="Discount Type" value={form.discountType} onChange={e => set('discountType', e.target.value)} options={[{ label: 'Percentage (%)', value: 'percentage' }, { label: 'Fixed (₹)', value: 'fixed' }]} />
        <Input label={`Discount Value (${form.discountType === 'percentage' ? '%' : '₹'})`} type="number" value={form.discountValue} onChange={e => set('discountValue', Number(e.target.value))} />
        {form.type === 'order' && <Input label="Minimum Order Amount (₹)" type="number" value={form.minOrderAmount ?? ''} onChange={e => set('minOrderAmount', Number(e.target.value))} />}
        {form.type === 'product' && (
          <>
            <Input label="Product ID" value={form.productId ?? ''} onChange={e => set('productId', e.target.value)} placeholder="Product ID" />
            <Input label="Minimum Quantity" type="number" value={form.minProductQuantity ?? ''} onChange={e => set('minProductQuantity', Number(e.target.value))} />
          </>
        )}
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

export const Coupons: React.FC = () => {
  const qc = useQueryClient();
  const { data: coupons = [], isLoading: cl } = useQuery({ queryKey: ['coupons'], queryFn: couponService.mockGetAll });
  const { data: promos = [], isLoading: pl } = useQuery({ queryKey: ['promotions'], queryFn: promotionService.mockGetAll });
  const [tab, setTab] = useState<'coupons' | 'promotions'>('coupons');
  const [couponForm, setCouponForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | undefined>();
  const [promoForm, setPromoForm] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | undefined>();
  const [delCoupon, setDelCoupon] = useState<Coupon | undefined>();
  const [delPromo, setDelPromo] = useState<Promotion | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const removeCoupon = useMutation({ mutationFn: (id: string) => couponService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); setDelCoupon(undefined); } });
  const removePromo = useMutation({ mutationFn: (id: string) => promotionService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); setDelPromo(undefined); } });

  // Filter lists based on search query
  const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPromos = promos.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const couponCols = [
    { 
      key: 'code', 
      header: 'COUPON CODE', 
      render: (r: Coupon) => (
        <div>
          <span className="font-bold text-gray-800 tracking-wide text-sm">{r.code}</span>
          <p className="text-[10px] text-gray-400 mt-0.5 font-semibold uppercase">Manual Code</p>
        </div>
      ) 
    },
    { 
      key: 'discountType', 
      header: 'TYPE', 
      render: (r: Coupon) => (
        <span className="capitalize px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700">
          {r.discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}
        </span>
      ) 
    },
    { 
      key: 'discountValue', 
      header: 'VALUE', 
      render: (r: Coupon) => (
        <span className="font-extrabold text-odoo-teal text-sm">
          {r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue.toFixed(2)}`}
        </span>
      ) 
    },
    { 
      key: 'isActive', 
      header: 'STATUS', 
      render: (r: Coupon) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
          r.isActive 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {r.isActive ? 'Active' : 'Expired'}
        </span>
      ) 
    },
    { 
      key: 'usageCount', 
      header: 'USAGE', 
      render: (r: Coupon) => {
        const totalUsage = r.maxUsageCount || 100;
        const currentUsage = r.usageCount || 0;
        const ratio = Math.min((currentUsage / totalUsage) * 100, 100);
        
        return (
          <div className="w-36">
            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-500 mb-1">
              <span>{r.maxUsageCount ? `${currentUsage}/${totalUsage} used` : 'Unlimited'}</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${r.isActive ? 'bg-odoo-teal' : 'bg-gray-400'}`} 
                style={{ width: r.maxUsageCount ? `${ratio}%` : '100%' }}
              />
            </div>
          </div>
        );
      } 
    },
    { 
      key: 'actions', 
      header: 'ACTIONS', 
      render: (r: Coupon) => (
        <div className="flex gap-1.5 justify-end">
          <button 
            onClick={() => { setEditCoupon(r); setCouponForm(true); }}
            className="p-1.5 border border-gray-200 text-gray-600 hover:text-odoo-purple hover:border-odoo-purple rounded-lg bg-white shadow-sm transition-all cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setDelCoupon(r)}
            className="p-1.5 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 rounded-lg bg-white shadow-sm transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) 
    },
  ];

  const promoCols = [
    { 
      key: 'name', 
      header: 'PROMOTION NAME', 
      render: (r: Promotion) => (
        <div>
          <span className="font-bold text-gray-800 text-sm">{r.name}</span>
          <p className="text-[10px] text-gray-400 mt-0.5 font-semibold uppercase">{r.type === 'order' ? 'Order Trigger' : 'Product Trigger'}</p>
        </div>
      ) 
    },
    { 
      key: 'type', 
      header: 'TYPE', 
      render: (r: Promotion) => (
        <span className="capitalize px-2.5 py-1 text-xs font-semibold rounded-md bg-gray-100 text-gray-700">
          {r.type === 'order' ? 'Order amount' : 'Product volume'}
        </span>
      ) 
    },
    { 
      key: 'discountValue', 
      header: 'DISCOUNT', 
      render: (r: Promotion) => (
        <span className="font-extrabold text-odoo-teal text-sm">
          {r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue.toFixed(2)}`}
        </span>
      ) 
    },
    { 
      key: 'trigger', 
      header: 'TRIGGER LIMIT', 
      render: (r: Promotion) => (
        <span className="text-xs text-gray-500 font-semibold">
          {r.type === 'order' ? `Min order ₹${r.minOrderAmount}` : `Min product qty ${r.minProductQuantity}`}
        </span>
      ) 
    },
    { 
      key: 'isActive', 
      header: 'STATUS', 
      render: (r: Promotion) => (
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
          r.isActive 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {r.isActive ? 'Active' : 'Expired'}
        </span>
      ) 
    },
    { 
      key: 'actions', 
      header: 'ACTIONS', 
      render: (r: Promotion) => (
        <div className="flex gap-1.5 justify-end">
          <button 
            onClick={() => { setEditPromo(r); setPromoForm(true); }}
            className="p-1.5 border border-gray-200 text-gray-600 hover:text-odoo-purple hover:border-odoo-purple rounded-lg bg-white shadow-sm transition-all cursor-pointer"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setDelPromo(r)}
            className="p-1.5 border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 rounded-lg bg-white shadow-sm transition-all cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ) 
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Top statistics dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-50 text-odoo-purple rounded-xl border border-purple-100 shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Coupons</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">14 Active</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-teal-50 text-odoo-teal rounded-xl border border-teal-100 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Redemption Rate</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">24.5%</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-yellow-50 text-amber-600 rounded-xl border border-yellow-100 shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Discounted</p>
            <p className="text-2xl font-extrabold text-gray-800 mt-1">₹1,240.00</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-headers & Actions */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Subtabs matching mockup styling */}
        <div className="flex border-b border-gray-150 md:border-b-0">
          <button 
            onClick={() => setTab('coupons')} 
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === 'coupons' 
                ? 'border-odoo-teal text-odoo-teal' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Manual Coupons
          </button>
          <button 
            onClick={() => setTab('promotions')} 
            className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              tab === 'promotions' 
                ? 'border-odoo-teal text-odoo-teal' 
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Automated Promotions
          </button>
        </div>

        {/* Search and Create Buttons */}
        <div className="flex items-center gap-3 self-stretch md:self-auto">
          <div className="relative flex-1 md:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${tab}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-350 rounded-xl focus:outline-none focus:ring-2 focus:ring-odoo-teal focus:border-transparent transition-all"
            />
          </div>
          <Button 
            onClick={() => tab === 'coupons' ? (setEditCoupon(undefined), setCouponForm(true)) : (setEditPromo(undefined), setPromoForm(true))}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New {tab === 'coupons' ? 'Coupon' : 'Promotion'}
          </Button>
        </div>
      </div>

      {/* Main Table view */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {tab === 'coupons'
          ? <DataTable columns={couponCols} data={filteredCoupons as unknown as Record<string, unknown>[]} loading={cl} />
          : <DataTable columns={promoCols} data={filteredPromos as unknown as Record<string, unknown>[]} loading={pl} />
        }
      </div>

      <CouponFormModal open={couponForm} onClose={() => setCouponForm(false)} initial={editCoupon} />
      <PromotionFormModal open={promoForm} onClose={() => setPromoForm(false)} initial={editPromo} />
      <ConfirmDeleteModal open={!!delCoupon} onClose={() => setDelCoupon(undefined)} onConfirm={() => delCoupon && removeCoupon.mutate(delCoupon.id)} loading={removeCoupon.isPending} />
      <ConfirmDeleteModal open={!!delPromo} onClose={() => setDelPromo(undefined)} onConfirm={() => delPromo && removePromo.mutate(delPromo.id)} loading={removePromo.isPending} />
    </div>
  );
};
