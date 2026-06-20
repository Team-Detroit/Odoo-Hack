import React from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  confirmText = 'Save',
  cancelText = 'Cancel',
  isConfirming = false,
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-lg ${sizeClasses[size]} w-full mx-4`}>
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isConfirming}>
            {cancelText}
          </Button>
          {onConfirm && (
            <Button
              variant="primary"
              onClick={onConfirm}
              isLoading={isConfirming}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
