import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { getSocket, connectSocket, disconnectSocket, onSocketEvent, offSocketEvent } from '../lib/socket';

interface SocketContextType {
  connect: () => void;
  disconnect: () => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
  emit: (event: string, data?: unknown) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value: SocketContextType = {
    connect: connectSocket,
    disconnect: disconnectSocket,
    on: onSocketEvent,
    off: offSocketEvent,
    emit: (event, data) => {
      const socket = getSocket();
      if (socket.connected) {
        socket.emit(event, data);
      }
    },
  };

  useEffect(() => {
    // Auto-connect on mount
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
