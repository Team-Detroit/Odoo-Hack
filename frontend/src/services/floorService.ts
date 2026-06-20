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
      name: 'Main Floor',
      isActive: true,
      tables: [
        { id: 't1', floorId: '1', tableNumber: 1, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 26, y: 5, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't2', floorId: '1', tableNumber: 2, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 40, y: 5, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't3', floorId: '1', tableNumber: 3, numberOfSeats: 6, isActive: true, hasActiveOrder: false, x: 54, y: 5, width: 16, height: 14, shape: 'rectangle', createdAt: '', updatedAt: '' },
        { id: 't4', floorId: '1', tableNumber: 4, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 26, y: 28, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't5', floorId: '1', tableNumber: 5, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 40, y: 28, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't6', floorId: '1', tableNumber: 6, numberOfSeats: 6, isActive: true, hasActiveOrder: true, isOutOfService: false, pendingItemsCount: 1, currentTotal: 24.15, x: 54, y: 38, width: 16, height: 14, shape: 'rectangle', createdAt: '', updatedAt: '' },
        { id: 't7', floorId: '1', tableNumber: 7, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 26, y: 50, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't8', floorId: '1', tableNumber: 8, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 40, y: 50, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't9', floorId: '1', tableNumber: 9, numberOfSeats: 6, isActive: true, hasActiveOrder: false, x: 8, y: 73, width: 16, height: 14, shape: 'rectangle', createdAt: '', updatedAt: '' },
        { id: 't10', floorId: '1', tableNumber: 10, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 26, y: 73, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't11', floorId: '1', tableNumber: 11, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 40, y: 73, width: 10, height: 14, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't12', floorId: '1', tableNumber: 12, numberOfSeats: 6, isActive: true, hasActiveOrder: false, x: 54, y: 73, width: 16, height: 14, shape: 'rectangle', createdAt: '', updatedAt: '' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Patio',
      isActive: true,
      tables: [
        { id: 't13', floorId: '2', tableNumber: 1, numberOfSeats: 4, isActive: true, hasActiveOrder: false, x: 15, y: 20, width: 12, height: 16, shape: 'square', createdAt: '', updatedAt: '' },
        { id: 't14', floorId: '2', tableNumber: 2, numberOfSeats: 6, isActive: true, hasActiveOrder: false, x: 45, y: 20, width: 18, height: 16, shape: 'rectangle', createdAt: '', updatedAt: '' },
        { id: 't15', floorId: '2', tableNumber: 3, numberOfSeats: 2, isActive: true, hasActiveOrder: false, x: 15, y: 60, width: 12, height: 16, shape: 'round', createdAt: '', updatedAt: '' },
        { id: 't16', floorId: '2', tableNumber: 4, numberOfSeats: 4, isActive: true, hasActiveOrder: true, isOutOfService: false, pendingItemsCount: 3, currentTotal: 37.40, x: 45, y: 60, width: 12, height: 16, shape: 'square', createdAt: '', updatedAt: '' },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],

  mockGetAll: async (): Promise<Floor[]> => {
    return floorService.getAll();
  },
};
