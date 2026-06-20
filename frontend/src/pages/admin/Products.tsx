import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product, CreateProductRequest } from '../../types/product';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { UNITS_OF_MEASURE } from '../../constants/unitsOfMeasure';

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

export const Products: React.FC = () => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleting, setDeleting] = useState<Product | undefined>();

  const remove = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); setDeleting(undefined); },
  });

  const columns = [
    { key: 'name', header: 'Name', render: (r: Product) => <span className="font-medium">{r.name}</span> },
    { key: 'category', header: 'Category', render: (r: Product) => (
      <span className="px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: r.category?.color ?? '#6B7280' }}>{r.category?.name}</span>
    )},
    { key: 'price', header: 'Price', render: (r: Product) => <span>₹{r.price.toFixed(2)}</span> },
    { key: 'unitOfMeasure', header: 'UOM', render: (r: Product) => <span className="capitalize">{r.unitOfMeasure}</span> },
    { key: 'tax', header: 'Tax', render: (r: Product) => <span>{r.tax}%</span> },
    { key: 'isActive', header: 'Status', render: (r: Product) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.isActive ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (r: Product) => (
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setFormOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleting(r)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Products</h2>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }}>+ New Product</Button>
      </div>
      <DataTable columns={columns} data={data as unknown as Record<string, unknown>[]} loading={isLoading} />
      <ProductFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(undefined)} onConfirm={() => deleting && remove.mutate(deleting.id)} loading={remove.isPending} message={`Delete "${deleting?.name}"?`} />
    </div>
  );
};
