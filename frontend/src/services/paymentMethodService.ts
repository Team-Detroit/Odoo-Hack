import axiosInstance from '../lib/axios';
import { PaymentMethod, UpdatePaymentMethodRequest } from '../types/paymentMethod';

export const paymentMethodService = {
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get('/payment-methods');
    return response.data;
  },

  update: async (data: UpdatePaymentMethodRequest): Promise<PaymentMethod> => {
    const response = await axiosInstance.put(`/payment-methods/${data.type}`, data);
    return response.data;
  },

  mockMethods: [
    { id: '1', type: 'cash', isEnabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', type: 'card', isEnabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', type: 'upi', isEnabled: true, upiId: 'cafe@ybl', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],

  mockGetAll: async (): Promise<PaymentMethod[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(paymentMethodService.mockMethods), 300);
    });
  },
};
