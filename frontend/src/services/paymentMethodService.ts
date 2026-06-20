import axiosInstance from '../lib/axios';
import { PaymentMethod, UpdatePaymentMethodRequest } from '../types/paymentMethod';

export const paymentMethodService = {
  getAll: async (): Promise<PaymentMethod[]> => {
    const response = await axiosInstance.get('/payment-methods');
    return response.data;
  },

  update: async (data: UpdatePaymentMethodRequest): Promise<PaymentMethod> => {
    const current = await paymentMethodService.mockGetAll();
    const updated = current.map(m => m.type === data.type ? { ...m, ...data } : m);
    localStorage.setItem('payment_methods', JSON.stringify(updated));
    return updated.find(m => m.type === data.type);
  },

  mockMethods: [
    { id: '1', type: 'cash', isEnabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '2', type: 'card', isEnabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { id: '3', type: 'upi', isEnabled: true, upiId: 'cafe@ybl', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],

  mockGetAll: async (): Promise<PaymentMethod[]> => {
    const saved = localStorage.getItem('payment_methods');
    if (saved) {
      return JSON.parse(saved);
    }
    return paymentMethodService.mockMethods;
  },
};
