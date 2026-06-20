import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      {icon && (
        <div className="text-6xl mb-4 opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
