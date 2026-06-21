import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
