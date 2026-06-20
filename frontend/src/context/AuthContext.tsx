import React, { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadFromStorage = useAuthStore((s) => s.loadFromStorage);
  useEffect(() => { loadFromStorage(); }, [loadFromStorage]);
  return <>{children}</>;
};

export const useAuthContext = () => {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => { setIsLoading(false); }, []);
  return { ...store, isLoading };
};
