import React from 'react';
import { Outlet } from 'react-router-dom';
import { SocketProvider } from '../context/SocketContext';

export const CustomerDisplayLayout: React.FC = () => (
  <SocketProvider>
    <div className="h-screen overflow-hidden font-sans">
      <Outlet />
    </div>
  </SocketProvider>
);
