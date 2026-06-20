import axiosInstance from '../lib/axios';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosInstance.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateCategoryRequest>): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/categories/${id}`);
  },

  // Mock data
  mockCategories: [
    { id: '1', name: 'Beverages', color: '#3B82F6', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', name: 'Appetizers', color: '#F97316', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', name: 'Main Course', color: '#10B981', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],

  mockGetAll: async (): Promise<Category[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(categoryService.mockCategories), 300);
    });
  },
};
