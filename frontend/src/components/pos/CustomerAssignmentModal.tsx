import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User } from 'lucide-react';

interface CustomerAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onAssign: (name: string, email: string) => Promise<void>;
  onSkip: () => void;
  tableNumber: number;
}

export const CustomerAssignmentModal: React.FC<CustomerAssignmentModalProps> = ({
  open,
  onClose,
  onAssign,
  onSkip,
  tableNumber,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Customer name is required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAssign(name.trim(), email.trim());
      setName('');
      setEmail('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Assign Table T${tableNumber}`} size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2.5 p-3 bg-teal-50 border border-teal-100 rounded-xl mb-2">
          <div className="p-2 bg-teal-500 rounded-lg text-white">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-teal-800 leading-none">Customer Details</h4>
            <p className="text-[10px] text-teal-600 mt-0.5">Please record the customer name and email for this table.</p>
          </div>
        </div>

        {error && (
          <div className="text-xs font-semibold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <Input
          label="Customer Name *"
          placeholder="e.g. John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          label="Email Address (Optional)"
          type="email"
          placeholder="e.g. john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              setName('');
              setEmail('');
              onSkip();
              onClose();
            }}
            className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            disabled={loading}
          >
            Skip & Assign
          </button>
          <Button type="submit" isLoading={loading} className="bg-odoo-purple hover:bg-odoo-purple/90 text-xs font-bold px-5">
            Assign Seating
          </Button>
        </div>
      </form>
    </Modal>
  );
};
