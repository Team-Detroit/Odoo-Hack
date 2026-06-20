import axiosInstance from '../lib/axios';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../types/user';

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateUserRequest>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.post('/users/change-password', data);
  },

  mockUsers: [
    { id: '1', name: 'Admin User', email: 'admin@cafe.com', role: 'admin', isActive: true, createdAt: '', updatedAt: '' },
    { id: '2', name: 'John Cashier', email: 'john@cafe.com', role: 'employee', isActive: true, createdAt: '', updatedAt: '' },
  ],

  mockGetAll: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(userService.mockUsers), 300);
    });
  },
};
