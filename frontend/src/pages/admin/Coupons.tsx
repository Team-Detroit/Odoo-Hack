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

  const removeCoupon = useMutation({ mutationFn: (id: string) => couponService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['coupons'] }); setDelCoupon(undefined); } });
  const removePromo = useMutation({ mutationFn: (id: string) => promotionService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['promotions'] }); setDelPromo(undefined); } });

  const couponCols = [
    { key: 'code', header: 'Code', render: (r: Coupon) => <span className="font-mono font-semibold text-teal-700">{r.code}</span> },
    { key: 'discountType', header: 'Type', render: (r: Coupon) => <span className="capitalize">{r.discountType}</span> },
    { key: 'discountValue', header: 'Value', render: (r: Coupon) => <span>{r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue}`}</span> },
    { key: 'usageCount', header: 'Usage', render: (r: Coupon) => <span>{r.usageCount}{r.maxUsageCount ? ` / ${r.maxUsageCount}` : ''}</span> },
    { key: 'isActive', header: 'Status', render: (r: Coupon) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.isActive ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (r: Coupon) => <div className="flex gap-2 justify-end"><Button size="sm" variant="outline" onClick={() => { setEditCoupon(r); setCouponForm(true); }}>Edit</Button><Button size="sm" variant="danger" onClick={() => setDelCoupon(r)}>Delete</Button></div> },
  ];

  const promoCols = [
    { key: 'name', header: 'Name', render: (r: Promotion) => <span className="font-medium">{r.name}</span> },
    { key: 'type', header: 'Type', render: (r: Promotion) => <span className="capitalize px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">{r.type}</span> },
    { key: 'discountValue', header: 'Discount', render: (r: Promotion) => <span>{r.discountType === 'percentage' ? `${r.discountValue}%` : `₹${r.discountValue}`}</span> },
    { key: 'trigger', header: 'Trigger', render: (r: Promotion) => <span className="text-xs text-gray-500">{r.type === 'order' ? `Min ₹${r.minOrderAmount}` : `Min qty ${r.minProductQuantity}`}</span> },
    { key: 'isActive', header: 'Status', render: (r: Promotion) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.isActive ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (r: Promotion) => <div className="flex gap-2 justify-end"><Button size="sm" variant="outline" onClick={() => { setEditPromo(r); setPromoForm(true); }}>Edit</Button><Button size="sm" variant="danger" onClick={() => setDelPromo(r)}>Delete</Button></div> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['coupons', 'promotions'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              {t === 'coupons' ? '🎟️ Coupons' : '🎯 Promotions'}
            </button>
          ))}
        </div>
        <Button onClick={() => tab === 'coupons' ? (setEditCoupon(undefined), setCouponForm(true)) : (setEditPromo(undefined), setPromoForm(true))}>
          + New {tab === 'coupons' ? 'Coupon' : 'Promotion'}
        </Button>
      </div>

      {tab === 'coupons'
        ? <DataTable columns={couponCols} data={coupons as unknown as Record<string, unknown>[]} loading={cl} />
        : <DataTable columns={promoCols} data={promos as unknown as Record<string, unknown>[]} loading={pl} />
      }

      <CouponFormModal open={couponForm} onClose={() => setCouponForm(false)} initial={editCoupon} />
      <PromotionFormModal open={promoForm} onClose={() => setPromoForm(false)} initial={editPromo} />
      <ConfirmDeleteModal open={!!delCoupon} onClose={() => setDelCoupon(undefined)} onConfirm={() => delCoupon && removeCoupon.mutate(delCoupon.id)} loading={removeCoupon.isPending} />
      <ConfirmDeleteModal open={!!delPromo} onClose={() => setDelPromo(undefined)} onConfirm={() => delPromo && removePromo.mutate(delPromo.id)} loading={removePromo.isPending} />
    </div>
  );
};
