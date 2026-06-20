import React from 'react';

interface BadgeProps { children: React.ReactNode; color?: string; className?: string; }
export const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    style={color ? { backgroundColor: color + '22', color } : undefined}
  >
    {children}
  </span>
);
