import React, { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAuthContext = () => useAuthStore();
