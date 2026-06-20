import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/userService';
import { User, CreateUserRequest } from '../../types/user';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { ConfirmDeleteModal } from '../../components/common/ConfirmDeleteModal';

const UserFormModal: React.FC<{ open: boolean; onClose: () => void; initial?: User }> = ({ open, onClose, initial }) => {
  const qc = useQueryClient();
  const [form, setForm] = useState<CreateUserRequest>({ name: '', email: '', password: '', role: 'employee' });
  React.useEffect(() => { if (initial) setForm({ name: initial.name, email: initial.email, password: '', role: initial.role }); else setForm({ name: '', email: '', password: '', role: 'employee' }); }, [initial, open]);
  const save = useMutation({ mutationFn: () => initial ? userService.update(initial.id, form) : userService.create(form), onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); onClose(); } });
  const set = (k: keyof CreateUserRequest, v: string) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit User' : 'New User'} size="sm">
      <div className="space-y-3">
        <Input label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
        {!initial && <Input label="Password" type="password" value={form.password} onChange={e => set('password', e.target.value)} />}
        <Select label="Role" value={form.role} onChange={e => set('role', e.target.value)} options={[{ label: 'Admin', value: 'admin' }, { label: 'Employee / Cashier', value: 'employee' }]} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => save.mutate()} isLoading={save.isPending}>Save</Button>
      </div>
    </Modal>
  );
};

const ChangePasswordModal: React.FC<{ open: boolean; onClose: () => void; user?: User }> = ({ open, onClose, user }) => {
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const change = useMutation({ mutationFn: () => userService.changePassword({ userId: user!.id, oldPassword: oldPw, newPassword: newPw }), onSuccess: onClose });
  return (
    <Modal open={open} onClose={onClose} title="Change Password" size="sm">
      <div className="space-y-3">
        <Input label="Old Password" type="password" value={oldPw} onChange={e => setOldPw(e.target.value)} />
        <Input label="New Password" type="password" value={newPw} onChange={e => setNewPw(e.target.value)} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => change.mutate()} isLoading={change.isPending}>Update</Button>
      </div>
    </Modal>
  );
};

export const Users: React.FC = () => {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: userService.mockGetAll });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<User | undefined>();
  const [deleting, setDeleting] = useState<User | undefined>();
  const [changePw, setChangePw] = useState<User | undefined>();

  const remove = useMutation({ mutationFn: (id: string) => userService.delete(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setDeleting(undefined); } });
  const archive = useMutation({ mutationFn: (u: User) => userService.update(u.id, { ...u, role: u.role }), onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }) });

  const columns = [
    { key: 'name', header: 'Name', render: (r: User) => <span className="font-medium">{r.name}</span> },
    { key: 'email', header: 'Email', render: (r: User) => <span className="text-gray-500">{r.email}</span> },
    { key: 'role', header: 'Role', render: (r: User) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{r.role === 'admin' ? 'Admin' : 'Employee'}</span> },
    { key: 'isActive', header: 'Status', render: (r: User) => <span className={`px-2 py-0.5 rounded text-xs font-medium ${r.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.isActive ? 'Active' : 'Archived'}</span> },
    { key: 'actions', header: '', render: (r: User) => (
      <div className="flex gap-2 justify-end flex-wrap">
        <Button size="sm" variant="outline" onClick={() => { setEditing(r); setFormOpen(true); }}>Edit</Button>
        <Button size="sm" variant="secondary" onClick={() => setChangePw(r)}>Password</Button>
        <Button size="sm" variant="ghost" onClick={() => archive.mutate(r)}>{r.isActive ? 'Archive' : 'Restore'}</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleting(r)}>Delete</Button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Users & Employees</h2>
        <Button onClick={() => { setEditing(undefined); setFormOpen(true); }}>+ New User</Button>
      </div>
      <DataTable columns={columns} data={data as unknown as Record<string, unknown>[]} loading={isLoading} />
      <UserFormModal open={formOpen} onClose={() => setFormOpen(false)} initial={editing} />
      <ChangePasswordModal open={!!changePw} onClose={() => setChangePw(undefined)} user={changePw} />
      <ConfirmDeleteModal open={!!deleting} onClose={() => setDeleting(undefined)} onConfirm={() => deleting && remove.mutate(deleting.id)} loading={remove.isPending} />
    </div>
  );
};
