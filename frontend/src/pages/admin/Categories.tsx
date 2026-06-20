import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services/categoryService';
import { Category, CreateCategoryRequest } from '../../types/category';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const COLORS = ['#3B82F6','#10B981','#F97316','#EF4444','#8B5CF6','#EC4899','#F59E0B','#14B8A6'];

const CategoryFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Category }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [name, setName] = useState(initial?.name ?? '');
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);

  React.useEffect(() => { setName(initial?.name ?? ''); setColor(initial?.color ?? COLORS[0]); }, [initial]);

  const save = useMutation({
    mutationFn: (d: CreateCategoryRequest) => initial ? categoryService.update(initial.id, d) : categoryService.create(d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); onClose(); },
  });

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Category' : 'New Category'} size="sm">
      <div className="space-y-4">
        <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Beverages" />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-gray-500">{color}</span>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => save.mutate({ name, color })} isLoading={save.isPending}>Save</Button>
        </div>
      </div>
    </Modal>
  );
};

export const Categories: React.FC = () => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleting, setDeleting] = useState<Category | undefined>();

  const remove = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); setDeleting(undefined); },
  });

  const columns = [
    { key: 'color', header: 'Color', width: '60px', render: (r: Category) => <div className="w-6 h-6 rounded-full" style={{ backgroundColor: r.color }} /> },
    { key: 'name', header: 'Name', render: (r: Category) => <span className="font-medium">{r.name}</span> },
    { key: 'isActive', header: 'Status', render: (r: Category) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.isActive ? 'Active' : 'Inactive'}</span> },
    { key: 'actions', header: '', render: (r: Category) => (
      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setFormOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleting(r)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }}>+ New Category</Button>
      </div>
      <DataTable columns={columns} data={data as unknown as Record<string, unknown>[]} loading={isLoading} />
      <CategoryFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(undefined)} onConfirm={() => deleting && remove.mutate(deleting.id)} loading={remove.isPending} message={`Delete "${deleting?.name}"?`} />
    </div>
  );
};
