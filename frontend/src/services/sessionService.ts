import axiosInstance from '../lib/axios';
import { Session, CreateSessionRequest, CloseSessionRequest } from '../types/session';

export const sessionService = {
  getAll: async (): Promise<Session[]> => {
    const response = await axiosInstance.get('/sessions');
    return response.data.data?.sessions || response.data.data || [];
  },

  getById: async (id: string): Promise<Session> => {
    const response = await axiosInstance.get(`/sessions/${id}`);
    return response.data.data?.sessions || response.data.data || [];
  },

  getCurrentActive: async (): Promise<Session | null> => {
    try {
      const response = await axiosInstance.get('/sessions/current');
      return response.data.data?.session || response.data.data || null;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  create: async (data: CreateSessionRequest): Promise<Session> => {
    const response = await axiosInstance.post('/sessions/open', data);
    return response.data.data?.session || response.data.data || response.data;
  },

  close: async (data: CloseSessionRequest): Promise<Session> => {
    const response = await axiosInstance.post('/sessions/close', data);
    return response.data.data?.session || response.data.data || response.data;
  },

  mockGetActive: async (): Promise<Session | null> => {
    return sessionService.getCurrentActive();
  },
};
