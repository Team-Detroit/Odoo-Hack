import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-4">
    <div className="w-full max-w-sm">
      <Outlet />
    </div>
  </div>
);
