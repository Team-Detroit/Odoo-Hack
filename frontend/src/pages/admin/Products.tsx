import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Product } from '../../types/product';

export const Products: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products] = useState<Product[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Product Name' },
            { key: 'categoryId', label: 'Category' },
            { key: 'price', label: 'Price' },
            { key: 'tax', label: 'Tax %' },
          ]}
          data={products}
          emptyMessage="No products added yet"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Product"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Product Name" placeholder="e.g., Biryani" />
          <Select
            label="Category"
            options={[
              { value: '1', label: 'Beverages' },
              { value: '2', label: 'Appetizers' },
            ]}
          />
          <Input label="Price" type="number" placeholder="100" />
          <Input label="Tax %" type="number" placeholder="5" />
        </div>
      </Modal>
    </div>
  );
};
