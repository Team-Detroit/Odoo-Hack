import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Coupon } from '../../types/coupon';

export const Coupons: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coupons] = useState<Coupon[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Coupon</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { key: 'code', label: 'Code' },
            { key: 'discountValue', label: 'Discount' },
            { key: 'discountType', label: 'Type' },
            { key: 'usageCount', label: 'Used' },
          ]}
          data={coupons}
          emptyMessage="No coupons created yet"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Coupon"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Coupon Code" placeholder="WELCOME10" />
          <Input label="Discount Value" type="number" placeholder="10" />
        </div>
      </Modal>
    </div>
  );
};
