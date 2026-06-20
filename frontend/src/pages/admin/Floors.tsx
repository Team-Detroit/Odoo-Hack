import React, { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';

export const Floors: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [floors] = useState<any[]>([]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Floors & Tables</h1>
        <Button onClick={() => setIsModalOpen(true)}>Add Floor</Button>
      </div>

      {floors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600">No floors configured yet.</p>
          <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
            Create Your First Floor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Floor cards will go here */}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Add Floor"
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-4">
          <Input label="Floor Name" placeholder="Ground Floor" />
        </div>
      </Modal>
    </div>
  );
};
