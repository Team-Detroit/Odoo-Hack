import { useSessionStore } from '../store/sessionStore';
import axiosInstance from '../lib/axios';
import { Order, CreateOrderRequest, UpdateOrderRequest, OrderStatus } from '../types/order';

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders');
    return response.data.data?.orders || response.data.data || [];
  },

  getById: async (id: string): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data.data?.order || response.data.data || response.data;
  },

  getBySession: async (sessionId: string): Promise<Order[]> => {
    const response = await axiosInstance.get(`/orders?sessionId=${sessionId}`);
    return response.data.data?.orders || response.data.data || [];
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await axiosInstance.post('/orders', data);
    return response.data.data?.order || response.data.data || response.data;
  },

  update: async (id: string, data: Partial<CreateOrderRequest>): Promise<Order> => {
    const response = await axiosInstance.put(`/orders/${id}`, data);
    return response.data.data?.order || response.data.data || response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/orders/${id}`);
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const response = await axiosInstance.patch(`/orders/${id}/status`, { status });
    return response.data.data?.order || response.data.data || response.data;
  },

  sendToKitchen: async (id: string): Promise<Order> => {
    const response = await axiosInstance.patch(`/orders/${id}/send-to-kitchen`);
    return response.data.data?.order || response.data.data || response.data;
  },

  mockGetBySession: async (): Promise<Order[]> => {
    const session = useSessionStore.getState().session;
    if (session) {
      return orderService.getBySession(session.id);
    }
    return orderService.getAll();
  },
};
