import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDeleteModalProps { open: boolean; onClose: () => void; onConfirm: () => void; title?: string; message?: string; loading?: boolean; }
export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ open, onClose, onConfirm, title = 'Delete Item', message = 'Are you sure? This action cannot be undone.', loading }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm">
    <p className="text-sm text-gray-600 mb-5">{message}</p>
    <div className="flex gap-3 justify-end">
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} isLoading={loading}>Delete</Button>
    </div>
  </Modal>
);
