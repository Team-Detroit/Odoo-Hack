import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, CreateProductRequest } from '../../types/product';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { UNITS_OF_MEASURE } from '../../constants/unitsOfMeasure';

// ─── Product Form Modal (unchanged logic) ────────────────────────────────────

const ProductFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Product }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  const [form, setForm] = useState<CreateProductRequest>({ name: '', categoryId: '', price: 0, unitOfMeasure: 'piece', tax: 0, description: '' });
  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);

  React.useEffect(() => {
    if (initial) setForm({ name: initial.name, categoryId: initial.categoryId, price: initial.price, unitOfMeasure: initial.unitOfMeasure, tax: initial.tax, description: initial.description ?? '' });
    else setForm({ name: '', categoryId: '', price: 0, unitOfMeasure: 'piece', tax: 0, description: '' });
  }, [initial, open]);

  const createCat = useMutation({
    mutationFn: () => categoryService.create({ name: newCatName, color: '#10B981' }),
    onSuccess: (cat) => { qc.invalidateQueries({ queryKey: ['categories'] }); setForm(f => ({ ...f, categoryId: cat.id })); setShowNewCat(false); setNewCatName(''); },
  });

  const save = useMutation({
    mutationFn: (d: CreateProductRequest) => initial ? productService.update(initial.id, d) : productService.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); onClose(); },
  });

  const set = (k: keyof CreateProductRequest, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Product' : 'New Product'} size="lg">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Name" value={form.name} onChange={e => set('name', e.target.value)} className="col-span-2" />
        <div>
          <div className="flex items-end gap-2">
            <Select label="Category" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}
              options={categories.map(c => ({ label: c.name, value: c.id }))} placeholder="Select category" />
            <Button size="sm" variant="outline" onClick={() => setShowNewCat(!showNewCat)} className="shrink-0 mb-0.5">+</Button>
          </div>
          {showNewCat && (
            <div className="mt-2 flex gap-2">
              <Input placeholder="New category name" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
              <Button size="sm" onClick={() => createCat.mutate()} isLoading={createCat.isPending}>Add</Button>
            </div>
          )}
        </div>
        <Input label="Price (₹)" type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} />
        <Select label="Unit of Measure" value={form.unitOfMeasure} onChange={e => set('unitOfMeasure', e.target.value as 'piece' | 'kg' | 'litre')}
          options={UNITS_OF_MEASURE.map(u => ({ label: u.label, value: u.value }))} />
        <Input label="Tax (%)" type="number" value={form.tax} onChange={e => set('tax', Number(e.target.value))} />
        <Input label="Description" value={form.description ?? ''} onChange={e => set('description', e.target.value)} className="col-span-2" />
      </div>
      <div className="flex gap-2 justify-end mt-5">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate(form)} isLoading={save.isPending}>Save Product</Button>
      </div>
    </Modal>
  );
};

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: React.ReactNode;
  sub: React.ReactNode;
  subColor?: string;
}> = ({ label, value, sub, subColor = 'text-gray-400' }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-1 shadow-sm">
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
    <p className="text-3xl font-bold text-gray-900 leading-tight">{value}</p>
    <p className={`text-xs font-semibold ${subColor}`}>{sub}</p>
  </div>
);

// ─── Products Page ────────────────────────────────────────────────────────────

export const Products: React.FC = () => {
  const qc = useQueryClient();
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleting, setDeleting] = useState<Product | undefined>();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  const remove = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setDeleting(undefined); },
  });

  // ── Derived stats ──
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.isActive).length;
  const outOfStock = products.filter(p => !p.isActive).length;
  const avgMargin = useMemo(() => {
    const withCost = products.filter(p => p.cost != null && p.price > 0);
    if (!withCost.length) return 78; // fallback
    return Math.round(withCost.reduce((acc, p) => acc + ((p.price - (p.cost ?? 0)) / p.price) * 100, 0) / withCost.length);
  }, [products]);

  // ── Filtered list ──
  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchesCat = activeCat === 'all' || p.categoryId === activeCat;
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [products, activeCat, search]);

  // ── Margin helper ──
  const margin = (p: Product) => {
    if (!p.cost || p.price === 0) return null;
    return Math.round(((p.price - p.cost) / p.price) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50/60 px-6 py-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-odoo-purple mb-1">Administrative Panel</p>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Product Catalog Registry</h1>
          <p className="text-sm text-gray-400 mt-0.5">Configure pricing models, item taxes, unit of measures (UOMs), and images.</p>
        </div>
        <button
          onClick={() => { setEditing(undefined); setFormOpen(true); }}
          className="flex items-center gap-2 bg-odoo-purple hover:bg-odoo-purple-hover text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-sm transition-colors uppercase tracking-wide"
        >
          + Add New Product
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard
          label="Total Products"
          value={totalProducts}
          sub="+12% from last month"
          subColor="text-emerald-500"
        />
        <StatCard
          label="Active Menu Items"
          value={activeProducts}
          sub={`Across ${categories.length} categories`}
          subColor="text-gray-400"
        />
        <StatCard
          label="Out of Stock"
          value={<span className={outOfStock > 0 ? 'text-orange-500' : 'text-gray-900'}>{outOfStock}</span>}
          sub={outOfStock > 0 ? 'Needs immediate attention' : 'All items in stock'}
          subColor={outOfStock > 0 ? 'text-orange-500' : 'text-emerald-500'}
        />
        <StatCard
          label="Avg. Profit Margin"
          value={`${avgMargin}%`}
          sub="High performance tier"
          subColor="text-emerald-500"
        />
      </div>

      {/* ── Search + Category filter bar ── */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search catalog items..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-white w-60 focus:outline-none focus:ring-2 focus:ring-odoo-purple/30 placeholder-gray-300"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 font-semibold mr-1 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M9 18h6" /></svg>
            Filter:
          </span>
          <button
            onClick={() => setActiveCat('all')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeCat === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${activeCat === cat.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Export icon */}
        <button className="ml-auto p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-6 py-3 border-b border-gray-100">
          {['Name & Thumbnail', 'Category', 'Price', 'Cost', 'UOM', 'Tax Rate', 'Actions'].map(h => (
            <p key={h} className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{h}</p>
          ))}
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="py-16 text-center text-gray-300 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-300 text-sm">No products found.</div>
        ) : (
          filtered.map((p, i) => {
            const m = margin(p);
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr_0.8fr_auto] gap-4 px-6 py-4 items-center transition-colors hover:bg-gray-50/60 ${i !== filtered.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                {/* Name & thumbnail */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      : <span className="text-lg">🍽️</span>
                    }
                  </div>
                  <span className="font-semibold text-gray-900 text-sm leading-tight">{p.name}</span>
                </div>

                {/* Category */}
                <span className="text-xs font-bold tracking-wide uppercase" style={{ color: p.category?.color ?? '#6366f1' }}>
                  {p.category?.name ?? '—'}
                </span>

                {/* Price */}
                <span className="font-bold text-gray-900 text-sm">₹{p.price.toFixed(2)}</span>

                {/* Cost + margin */}
                <div>
                  {p.cost != null ? (
                    <>
                      <p className="text-sm text-gray-700 font-medium">₹{p.cost.toFixed(2)}</p>
                      {m !== null && (
                        <p className="text-xs text-odoo-purple font-semibold">({m}% Margin)</p>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </div>

                {/* UOM */}
                <span className="text-sm text-gray-500 capitalize">{p.unitOfMeasure}</span>

                {/* Tax */}
                <span className="text-sm text-gray-500">{p.tax}%</span>

                {/* Actions */}
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => { setEditing(p); setFormOpen(true); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-odoo-purple hover:text-odoo-purple-hover border border-odoo-purple-light rounded-lg px-3 py-1.5 transition-colors bg-odoo-purple-light hover:bg-odoo-purple-light/80"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleting(p)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Modals ── */}
      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(undefined)}
        onConfirm={() => deleting && remove.mutate(deleting.id)}
        loading={remove.isPending}
        message={`Delete "${deleting?.name}"?`}
      />
    </div>
  );
};