import React from 'react';
import { Outlet } from 'react-router-dom';

export const KdsLayout: React.FC = () => (
  <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
    <Outlet />
  </div>
);
