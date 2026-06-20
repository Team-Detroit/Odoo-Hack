import axiosInstance from '../lib/axios';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh');
    return response.data;
  },

  // Mock methods for when backend isn't ready
  mockLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: 'John Doe',
            email,
            role: email.includes('admin') ? 'admin' : 'employee',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock_token_' + Date.now(),
        });
      }, 500);
    });
  },

  mockSignup: async (name: string, email: string): Promise<AuthResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: Date.now().toString(),
            name,
            email,
            role: 'employee',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock_token_' + Date.now(),
        });
      }, 500);
    });
  },
};
