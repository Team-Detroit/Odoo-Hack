import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/pos/Navbar';
import { useSessionStore } from '../store/sessionStore';
import { sessionService } from '../services/sessionService';

export const PosLayout: React.FC = () => {
  const [search, setSearch] = useState('');
  const { session, setSession } = useSessionStore();

  useEffect(() => {
    const initSession = async () => {
      try {
        const active = await sessionService.getCurrentActive();
        if (active) {
          setSession(active);
        } else {
          // Create a new session automatically if none is active on the backend
          const newSession = await sessionService.create({
            employeeId: '',
            openingBalance: 0
          });
          setSession(newSession);
        }
      } catch (e) {
        console.error("Session auto-initialization failed:", e);
      }
    };
    initSession();
  }, [setSession]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Navbar onSearch={setSearch} />
      <div className="flex-1 overflow-auto">
        <Outlet context={{ search }} />
      </div>
    </div>
  );
};
