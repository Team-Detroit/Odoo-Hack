import axiosInstance from '../lib/axios';
import { Session, CreateSessionRequest, CloseSessionRequest } from '../types/session';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    const response = await axiosInstance.get('/sessions');
    return response.data;
  },

  getById: async (id: string): Promise<Session> => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data;
  },

  getCurrentActive: async (): Promise<Session | null> => {
    const response = await axiosInstance.get('/sessions/current');
    return response.data || null;
  },

  create: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await axiosInstance.post('/sessions', data);
    return response.data;
  },

  close: async (data: CloseSessionRequest): Promise<Session> => {
    const response = await axiosInstance.post(`/sessions/${data.sessionId}/close`, data);
    return response.data;
  },

  mockGetActive: async (): Promise<Session | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'sess1',
          employeeId: '2',
          openedAt: new Date().toISOString(),
          openingBalance: 1000,
          totalSales: 2500,
          totalOrders: 8,
          isActive: true,
          createdAt: '',
          updatedAt: '',
        });
      }, 300);
    });
  },
};
