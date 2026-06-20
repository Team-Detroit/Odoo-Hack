import React, { useState } from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Category } from '../../types/category';

export const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories] = useState<Category[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Category Name' },
            {
              key: 'color',
              label: 'Color',
              render: (color) => (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{color}</span>
                </div>
              ),
            },
          ]}
          data={categories}
          emptyMessage="No categories added yet"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        title="Add Category"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Category Name" placeholder="e.g., Beverages" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="color"
              className="w-full h-10 border border-gray-300 rounded cursor-pointer"
              defaultValue="#3B82F6"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
