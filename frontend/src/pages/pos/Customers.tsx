import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

export const Customers: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers] = useState<any[]>([]);

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Customers</h1>
          <Input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96"
          />
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Customer</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            { key: 'orderCount', label: 'Orders' },
          ]}
          data={customers}
          emptyMessage="No customers found"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Customer"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Customer name" />
          <Input label="Email" type="email" placeholder="customer@example.com" />
          <Input label="Phone" placeholder="10-digit phone number" />
        </div>
      </Modal>
    </div>
  );
};
