import axiosInstance from '../lib/axios';
import { Coupon, CreateCouponRequest, UpdateCouponRequest } from '../types/coupon';

const mapCoupon = (c: any): Coupon => {
  if (!c) return c;
  return {
    id: c.id,
    code: c.code,
    discountType: c.discountType || 'percentage',
    discountValue: c.discountValue !== undefined ? c.discountValue : (c.discount || 0),
    isActive: c.isActive !== undefined ? c.isActive : (c.active !== undefined ? c.active : true),
    usageCount: c.usageCount || 0,
    maxUsageCount: c.maxUsageCount || 100,
    description: c.description || '',
    expiryDate: c.expiryDate || '',
    minPurchase: c.minPurchase || undefined,
    minOrders: c.minOrders || undefined,
    monthsActive: c.monthsActive || undefined,
    newCustomerOnly: c.newCustomerOnly || false,
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString(),
  };
};

export const couponService = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await axiosInstance.get('/coupons');
    const coupons = response.data.data?.coupons || response.data.data || [];
    return Array.isArray(coupons) ? coupons.map(mapCoupon) : [];
  },

  getByCode: async (code: string): Promise<Coupon> => {
    const response = await axiosInstance.get(`/coupons/code/${code}`);
    const coupon = response.data.data?.coupon || response.data.data?.coupons || response.data.data || response.data;
    return mapCoupon(coupon);
  },

  create: async (data: CreateCouponRequest): Promise<Coupon> => {
    const backendData = {
      code: data.code,
      discountType: data.discountType || 'percentage',
      discountValue: data.discountValue,
      active: true,
      description: data.description,
      expiryDate: data.expiryDate || undefined,
      minPurchase: data.minPurchase || undefined,
      minOrders: data.minOrders || undefined,
      monthsActive: data.monthsActive || undefined,
      newCustomerOnly: data.newCustomerOnly || false,
    };
    const response = await axiosInstance.post('/coupons', backendData);
    const coupon = response.data.data?.coupon || response.data.data?.coupons || response.data.data || response.data;
    return mapCoupon(coupon);
  },

  update: async (id: string, data: Partial<CreateCouponRequest>): Promise<Coupon> => {
    const backendData: any = {};
    if (data.code !== undefined) backendData.code = data.code;
    if (data.discountType !== undefined) backendData.discountType = data.discountType;
    if (data.discountValue !== undefined) backendData.discountValue = data.discountValue;
    if (data.description !== undefined) backendData.description = data.description;
    if (data.expiryDate !== undefined) backendData.expiryDate = data.expiryDate || null;
    if (data.minPurchase !== undefined) backendData.minPurchase = data.minPurchase || null;
    if (data.minOrders !== undefined) backendData.minOrders = data.minOrders || null;
    if (data.monthsActive !== undefined) backendData.monthsActive = data.monthsActive || null;
    if (data.newCustomerOnly !== undefined) backendData.newCustomerOnly = data.newCustomerOnly;

    const response = await axiosInstance.put(`/coupons/${id}`, backendData);
    const coupon = response.data.data?.coupon || response.data.data?.coupons || response.data.data || response.data;
    return mapCoupon(coupon);
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
