import axiosInstance from '../lib/axios';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus } from '../types/order';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  getBySession: async (sessionId: string): Promise<Order[]> => {
    const response = await axiosInstance.get(`/orders?sessionId=${sessionId}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateOrderRequest>): Promise<Order> => {
    const response = await axiosInstance.put(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  sendToKitchen: async (id: string): Promise<Order> => {
    const response = await axiosInstance.post(`/orders/${id}/send-to-kitchen`);
    return response.data;
  },

  mockGetBySession: async (): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            orderNumber: 'ORD-001',
            sessionId: 'sess1',
            items: [],
            subtotal: 200,
            tax: 20,
            discount: 0,
            total: 220,
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }, 300);
    });
  },
};
