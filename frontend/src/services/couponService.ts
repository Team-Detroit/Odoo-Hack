import axiosInstance from '../lib/axios';
import { Coupon, CreateCouponRequest, UpdateCouponRequest } from '../types/coupon';

export const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await axiosInstance.get('/coupons');
    return response.data.data?.coupons || response.data.data || [];
  },

  getByCode: async (code: string): Promise<Coupon> => {
    const response = await axiosInstance.get(`/coupons/code/${code}`);
    return response.data.data?.coupons || response.data.data || [];
  },

  create: async (data: CreateCouponRequest): Promise<Coupon> => {
    const response = await axiosInstance.post('/coupons', data);
    return response.data.data?.coupons || response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateCouponRequest>): Promise<Coupon> => {
    const response = await axiosInstance.put(`/coupons/${id}`, data);
    return response.data.data?.coupons || response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/coupons/${id}`);
  },

  mockCoupons: [
    { id: '1', code: 'WELCOME10', discountType: 'percentage', discountValue: 10, isActive: true, usageCount: 5, maxUsageCount: 100, createdAt: '', updatedAt: '' },
    { id: '2', code: 'FLAT50', discountType: 'fixed', discountValue: 50, isActive: true, usageCount: 2, createdAt: '', updatedAt: '' },
  ],

  mockGetAll: async (): Promise<Coupon[]> => {
    return couponService.getAll();
  },
};
