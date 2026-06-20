import axiosInstance from '../lib/axios';
import { LoginRequest, SignupRequest, AuthResponse, User } from '../types/auth';

const normalizeUser = (user: any) => {
  if (user && typeof user.role === 'string') {
    return { ...user, role: user.role.toLowerCase() };
  }
  return user;
};

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    const resData = response.data.data || response.data;
    if (resData && resData.user) {
      resData.user = normalizeUser(resData.user);
    }
    return resData;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/signup', data);
    const resData = response.data.data || response.data;
    if (resData && resData.user) {
      resData.user = normalizeUser(resData.user);
    }
    return resData;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get('/auth/me');
    const user = response.data.data?.user || response.data.data || response.data;
    return normalizeUser(user);
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/refresh');
    const resData = response.data.data || response.data;
    if (resData && resData.user) {
      resData.user = normalizeUser(resData.user);
    }
    return resData;
  },

  // Mock methods for when backend isn't ready
  mockLogin: async (email: string, password: string): Promise<AuthResponse> => {
    return authService.login({ email, password });
  },

  mockSignup: async (name: string, email: string): Promise<AuthResponse> => {
    return authService.signup({ name, email, password: 'password123' });
  },
};
