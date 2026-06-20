import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { Customer, CreateCustomerRequest } from '../../types/customer';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Spinner';

const CustomerFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: Customer }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateCustomerRequest>({ name: '', email: '', phoneNumber: '' });
  React.useEffect(() => {
    if (initial) setForm({ name: initial.name, email: initial.email ?? '', phoneNumber: initial.phoneNumber ?? '' });
    else setForm({ name: '', email: '', phoneNumber: '' });
  }, [initial, open]);
  const save = useMutation({
    mutationFn: () => initial ? customerService.update(initial.id, form) : customerService.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); onClose(); },
  });
  const set = (k: keyof CreateCustomerRequest, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Customer' : 'New Customer'} size="sm">
      <div className="space-y-3">
        <Input label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} />
        <Input label="Email" type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value)} />
        <Input label="Phone Number" value={form.phoneNumber ?? ''} onChange={e => set('phoneNumber', e.target.value)} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

export const Customers: React.FC = () => {
  const qc = useQueryClient();
  const { data: customers = [], isLoading } = useQuery({ queryKey: ['customers'], queryFn: customerService.mockGetAll });
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | undefined>();
  const [deleting, setDeleting] = useState<Customer | undefined>();

  const remove = useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['customers'] }); setDeleting(undefined); },
  });

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.includes(search)
  );

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Customers</h2>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers…"
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <Button onClick={() => { setEditing(undefined); setFormOpen(true); }}>+ New Customer</Button>
        </div>
      </div>

      {filtered.length === 0 ? <EmptyState title="No customers found" /> : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>{['Name','Email','Phone','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.phoneNumber ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(c); setFormOpen(true); }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleting(c)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomerFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(undefined)} onConfirm={() => deleting && remove.mutate(deleting.id)} loading={remove.isPending} />
    </div>
  );
};
