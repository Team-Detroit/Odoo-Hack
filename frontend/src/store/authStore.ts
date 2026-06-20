import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      },

      setUser: (user) => {
        set((state) => ({
          ...state,
          user,
        }));
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      },

      loadFromStorage: () => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Failed to load auth from storage', error);
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
