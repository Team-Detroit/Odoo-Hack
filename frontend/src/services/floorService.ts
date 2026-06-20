import axiosInstance from '../lib/axios';
import { Floor, CreateFloorRequest, UpdateFloorRequest } from '../types/floor';

export const floorService = {
  getAll: async (): Promise<Floor[]> => {
    const response = await axiosInstance.get('/floors');
    return response.data.data?.floors || response.data.data || [];
  },

  getById: async (id: string): Promise<Floor> => {
    const response = await axiosInstance.get(`/floors/${id}`);
    return response.data.data?.floors || response.data.data || [];
  },

  create: async (data: CreateFloorRequest): Promise<Floor> => {
    const response = await axiosInstance.post('/floors', data);
    return response.data.data?.floors || response.data.data || [];
  },

  update: async (id: string, data: Partial<CreateFloorRequest>): Promise<Floor> => {
    const response = await axiosInstance.put(`/floors/${id}`, data);
    return response.data.data?.floors || response.data.data || [];
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/floors/${id}`);
  },

  mockFloors: [
    {
      id: '1',
      name: 'Ground Floor',
      isActive: true,
      tables: [
        { id: 't1', floorId: '1', tableNumber: 1, numberOfSeats: 4, isActive: true, hasActiveOrder: false, createdAt: '', updatedAt: '' },
        { id: 't2', floorId: '1', tableNumber: 2, numberOfSeats: 2, isActive: true, hasActiveOrder: false, createdAt: '', updatedAt: '' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],

  mockGetAll: async (): Promise<Floor[]> => {
    return floorService.getAll();
  },
};
