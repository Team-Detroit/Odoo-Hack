import React from 'react';
import { Outlet } from 'react-router-dom';

export const KdsLayout: React.FC = () => {
  return (
    <div className="h-screen bg-gray-900 text-white p-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Kitchen Display System</h1>
        <p className="text-gray-400">Current time: {new Date().toLocaleTimeString()}</p>
      </div>
      <Outlet />
    </div>
  );
};
