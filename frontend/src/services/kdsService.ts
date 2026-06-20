import axiosInstance from '../lib/axios';
import { KdsTicket, KdsFilter } from '../types/kds';

export const kdsService = {
  getTickets: async (filter?: KdsFilter): Promise<KdsTicket[]> => {
    const params = new URLSearchParams();
    if (filter?.stage) params.append('stage', filter.stage);
    if (filter?.searchTerm) params.append('search', filter.searchTerm);
    
    const response = await axiosInstance.get(`/kds/tickets?${params.toString()}`);
    return response.data;
  },

  getTicketById: async (id: string): Promise<KdsTicket> => {
    const response = await axiosInstance.get(`/kds/tickets/${id}`);
    return response.data;
  },

  updateTicketStage: async (id: string, stage: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(`/kds/tickets/${id}/stage`, { stage });
    return response.data;
  },

  updateItemStatus: async (ticketId: string, itemId: string, status: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(
      `/kds/tickets/${ticketId}/items/${itemId}/status`,
      { status }
    );
    return response.data;
  },

  mockGetAll: async (): Promise<KdsTicket[]> => {
    return kdsService.mockGetTickets();
  },

  updateStage: async (id: string, stage: string): Promise<KdsTicket> => {
    return kdsService.updateTicketStage(id, stage);
  },

  mockGetTickets: async (): Promise<KdsTicket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'ticket1',
            ticketNumber: 'T001',
            orderNumber: 'ORD-001',
            tableNumber: 1,
            customerName: 'Walk-in',
            items: [
              {
                id: 'item1',
                productId: 'prod1',
                productName: 'Biryani',
                quantity: 2,
                status: 'to_cook',
              },
            ],
            stage: 'to_cook',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }, 300);
    });
  },
};
