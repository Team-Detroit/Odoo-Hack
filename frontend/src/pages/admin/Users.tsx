import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';

export const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users] = useState<any[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users & Employees</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add User</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
          ]}
          data={users}
          emptyMessage="No users added yet"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add User"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="John Doe" />
          <Input label="Email" type="email" placeholder="john@cafe.com" />
          <Select
            label="Role"
            options={[
              { value: 'admin', label: 'Admin' },
              { value: 'employee', label: 'Employee' },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
};
