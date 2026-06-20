import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE" | "KITCHEN";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("auth_token"),
  isAuthenticated: !!localStorage.getItem("auth_token"),
  isLoading: false,

  setUser: (user: User) => set({ user, isAuthenticated: true }),
  
  setToken: (token: string) => {
    localStorage.setItem("auth_token", token);
    set({ token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
