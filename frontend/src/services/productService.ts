import axiosInstance from '../lib/axios';
import { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';

export const mapProductFromDb = (dbProduct: any): Product => {
  if (!dbProduct) return dbProduct;
  return {
    ...dbProduct,
    isActive: dbProduct.available ?? dbProduct.isActive ?? true,
    imageUrl: dbProduct.image ?? dbProduct.imageUrl ?? '',
  };
};

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/products');
    const list = response.data.data?.products || response.data.data || [];
    return Array.isArray(list) ? list.map(mapProductFromDb) : [];
  },

  getById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    const item = response.data.data?.product || response.data.data?.products || response.data.data || response.data;
    return mapProductFromDb(item);
  },

  getByCategory: async (categoryId: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products?categoryId=${categoryId}`);
    const list = response.data.data?.products || response.data.data || [];
    return Array.isArray(list) ? list.map(mapProductFromDb) : [];
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await axiosInstance.post('/products', data);
    const item = response.data.data?.product || response.data.data?.products || response.data.data || response.data;
    return mapProductFromDb(item);
  },

  update: async (id: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    const item = response.data.data?.product || response.data.data?.products || response.data.data || response.data;
    return mapProductFromDb(item);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/search?q=${query}`);
    const list = response.data.data?.products || response.data.data || [];
    return Array.isArray(list) ? list.map(mapProductFromDb) : [];
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
