import axiosInstance from '../lib/axios';
import { Table, CreateTableRequest, UpdateTableRequest } from '../types/table';

export const tableService = {
  getAll: async (): Promise<Table[]> => {
    const response = await axiosInstance.get('/tables');
    return response.data;
  },

  getByFloor: async (floorId: string): Promise<Table[]> => {
    const response = await axiosInstance.get(`/tables?floorId=${floorId}`);
    return response.data;
  },

  getById: async (id: string): Promise<Table> => {
    const response = await axiosInstance.get(`/tables/${id}`);
    return response.data;
  },

  create: async (data: CreateTableRequest): Promise<Table> => {
    const response = await axiosInstance.post('/tables', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateTableRequest>): Promise<Table> => {
    const response = await axiosInstance.put(`/tables/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tables/${id}`);
  },

  mockGetByFloor: async (): Promise<Table[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 't1', floorId: '1', tableNumber: 1, numberOfSeats: 4, isActive: true, hasActiveOrder: false, createdAt: '', updatedAt: '' },
          { id: 't2', floorId: '1', tableNumber: 2, numberOfSeats: 2, isActive: true, hasActiveOrder: true, createdAt: '', updatedAt: '' },
        ]);
      }, 300);
    });
  },
};
