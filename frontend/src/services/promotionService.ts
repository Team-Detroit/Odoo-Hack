import axiosInstance from '../lib/axios';
import { Promotion, CreatePromotionRequest, UpdatePromotionRequest } from '../types/promotion';

export const promotionService = {
  getAll: async (): Promise<Promotion[]> => {
    const response = await axiosInstance.get('/promotions');
    return response.data;
  },

  getById: async (id: string): Promise<Promotion> => {
    const response = await axiosInstance.get(`/promotions/${id}`);
    return response.data;
  },

  create: async (data: CreatePromotionRequest): Promise<Promotion> => {
    const response = await axiosInstance.post('/promotions', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreatePromotionRequest>): Promise<Promotion> => {
    const response = await axiosInstance.put(`/promotions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/promotions/${id}`);
  },

  mockPromotions: [
    {
      id: '1',
      name: 'Buy 2 Pizzas, Get 10% Off',
      type: 'product',
      discountType: 'percentage',
      discountValue: 10,
      productId: '1',
      minProductQuantity: 2,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      name: 'Minimum Order Promo',
      type: 'order',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 500,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ],

  mockGetAll: async (): Promise<Promotion[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(promotionService.mockPromotions), 300);
    });
  },
};
