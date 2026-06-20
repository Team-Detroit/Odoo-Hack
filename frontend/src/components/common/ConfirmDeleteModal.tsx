import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isDeleting = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      size="sm"
    >
      <div className="py-4">
        <p className="text-gray-700">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
};
