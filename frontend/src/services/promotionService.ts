import axiosInstance from '../lib/axios';
import { Promotion, CreatePromotionRequest, UpdatePromotionRequest } from '../types/promotion';

const mapPromotion = (p: any): Promotion => {
  if (!p) return p;
  return {
    id: p.id,
    name: p.name,
    type: p.type || 'order',
    discountType: p.discountType || 'percentage',
    discountValue: p.discountValue !== undefined ? p.discountValue : (p.discount || 0),
    productId: p.productId,
    minProductQuantity: p.minProductQuantity,
    minOrderAmount: p.minOrderAmount,
    isActive: p.isActive !== undefined ? p.isActive : (p.active !== undefined ? p.active : true),
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
  };
};

export const promotionService = {
  getAll: async (): Promise<Promotion[]> => {
    const response = await axiosInstance.get('/promotions');
    const promotions = response.data.data?.promotions || response.data.data || [];
    return Array.isArray(promotions) ? promotions.map(mapPromotion) : [];
  },

  getById: async (id: string): Promise<Promotion> => {
    const response = await axiosInstance.get(`/promotions/${id}`);
    const promotion = response.data.data?.promotion || response.data.data?.promotions || response.data.data || response.data;
    return mapPromotion(promotion);
  },

  create: async (data: CreatePromotionRequest): Promise<Promotion> => {
    const backendData = {
      name: data.name,
      discount: data.discountValue,
      active: true,
    };
    const response = await axiosInstance.post('/promotions', backendData);
    const promotion = response.data.data?.promotion || response.data.data?.promotions || response.data.data || response.data;
    return mapPromotion(promotion);
  },

  update: async (id: string, data: Partial<CreatePromotionRequest>): Promise<Promotion> => {
    const backendData: any = {};
    if (data.name !== undefined) backendData.name = data.name;
    if (data.discountValue !== undefined) backendData.discount = data.discountValue;
    const response = await axiosInstance.put(`/promotions/${id}`, backendData);
    const promotion = response.data.data?.promotion || response.data.data?.promotions || response.data.data || response.data;
    return mapPromotion(promotion);
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
          return promotionService.getAll();
        },
};
