import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';

interface AuthContextType {
  user: any;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const store = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      store.loadFromStorage();
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          await authService.getCurrentUser();
        } catch (error) {
          store.clearAuth();
        }
      } else {
        store.clearAuth();
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user: store.user,
      token: store.token,
      isAuthenticated: store.isAuthenticated,
      isLoading,
      clearAuth: store.clearAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
