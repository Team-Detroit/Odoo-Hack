import React from 'react';

interface EmptyStateProps { title: string; description?: string; action?: React.ReactNode; icon?: React.ReactNode; }
export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 text-gray-300">{icon ?? <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" /></svg>}</div>
    <h3 className="text-base font-medium text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
    {action}
  </div>
);
