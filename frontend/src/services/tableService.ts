import axiosInstance from '../lib/axios';
import { Table, CreateTableRequest, UpdateTableRequest } from '../types/table';

export const tableService = {
  getAll: async (): Promise<Table[]> => {
    const response = await axiosInstance.get('/tables');
    return response.data.data?.tables || response.data.data || [];
  },

  getByFloor: async (floorId: string): Promise<Table[]> => {
    const response = await axiosInstance.get(`/tables?floorId=${floorId}`);
    return response.data.data?.tables || response.data.data || [];
  },

  getById: async (id: string): Promise<Table> => {
    const response = await axiosInstance.get(`/tables/${id}`);
    return response.data.data?.tables || response.data.data || [];
  },

  create: async (data: CreateTableRequest): Promise<Table> => {
    const response = await axiosInstance.post('/tables', data);
    return response.data.data?.tables || response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateTableRequest>): Promise<Table> => {
    const response = await axiosInstance.put(`/tables/${id}`, data);
    return response.data.data?.tables || response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tables/${id}`);
  },

  mockGetByFloor: async (): Promise<Table[]> => {
    return tableService.getAll();
  },
};
