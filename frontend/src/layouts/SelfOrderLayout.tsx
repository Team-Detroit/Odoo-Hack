import React from 'react';
import { Outlet } from 'react-router-dom';

export const SelfOrderLayout: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Outlet />
  </div>
);
