import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/pos/Navbar';

export const PosLayout: React.FC = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Navbar onSearch={setSearch} />
      <div className="flex-1 overflow-auto">
        <Outlet context={{ search }} />
      </div>
    </div>
  );
};
