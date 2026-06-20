import React from 'react';

interface BadgeProps {
  text: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', size = 'md' }) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    primary: 'bg-teal-100 text-teal-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-block rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {text}
    </span>
  );
};
