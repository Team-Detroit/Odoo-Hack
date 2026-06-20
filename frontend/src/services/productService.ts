import axiosInstance from '../lib/axios';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products');
    return response.data.data?.products || response.data.data || [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data?.products || response.data.data || [];
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products?categoryId=${categoryId}`);
    return response.data.data?.products || response.data.data || [];
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await axiosInstance.post('/products', data);
    return response.data.data?.products || response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data.data?.products || response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/search?q=${query}`);
    return response.data.data?.products || response.data.data || [];
  },

  mockProducts: [
    {
      id: '1',
      name: 'Coffee',
      categoryId: '1',
      category: { id: '1', name: 'Beverages', color: '#3B82F6', isActive: true, createdAt: '', updatedAt: '' },
      price: 100,
      unitOfMeasure: 'piece',
      tax: 5,
      description: 'Hot freshly brewed coffee',
      isActive: true,
      showOnKds: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Tea',
      categoryId: '1',
      category: { id: '1', name: 'Beverages', color: '#3B82F6', isActive: true, createdAt: '', updatedAt: '' },
      price: 80,
      unitOfMeasure: 'piece',
      tax: 5,
      description: 'Hot tea',
      isActive: true,
      showOnKds: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  mockGetAll: async (): Promise<Product[]> => {
    return productService.getAll();
  },
};
