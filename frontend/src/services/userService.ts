import axiosInstance from '../lib/axios';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../types/user';

const normalizeUser = (user: any): User => {
  if (user && typeof user.role === 'string') {
    return { ...user, role: user.role.toLowerCase() as any };
  }
  return user;
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    const users = response.data.data?.users || response.data.data || [];
    return Array.isArray(users) ? users.map(normalizeUser) : [];
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    const user = response.data.data?.user || response.data.data || response.data;
    return normalizeUser(user);
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.post('/users', data);
    const user = response.data.data?.user || response.data.data || response.data;
    return normalizeUser(user);
  },

  update: async (id: string, data: Partial<CreateUserRequest>): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    const user = response.data.data?.user || response.data.data || response.data;
    return normalizeUser(user);
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
    return userService.getAll();
  },
};
