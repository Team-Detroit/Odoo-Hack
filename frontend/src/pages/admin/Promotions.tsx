import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const Promotions: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotions] = useState<any[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Promotions</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Promotion</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
            { key: 'discountValue', label: 'Discount' },
          ]}
          data={promotions}
          emptyMessage="No promotions created yet"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Promotion"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Promotion Name" placeholder="Buy 2, Get 10% Off" />
          <Input label="Discount Value" type="number" placeholder="10" />
        </div>
      </Modal>
    </div>
  );
};
