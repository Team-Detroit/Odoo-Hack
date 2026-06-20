import React from 'react';
import { Outlet } from 'react-router-dom';

export const CustomerDisplayLayout: React.FC = () => {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Outlet />
    </div>
  );
};
