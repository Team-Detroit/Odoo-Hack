import axiosInstance from '../lib/axios';
import { KdsTicket, KdsFilter } from '../types/kds';

export const kdsService = {
  getTickets: async (filter?: KdsFilter): Promise<KdsTicket[]> => {
    const params = new URLSearchParams();
    if (filter?.stage) params.append('stage', filter.stage);
    if (filter?.searchTerm) params.append('search', filter.searchTerm);
    
    const response = await axiosInstance.get(`/kitchen-tickets?${params.toString()}`);
    return response.data.data?.tickets || response.data.data || [];
  },

  getTicketById: async (id: string): Promise<KdsTicket> => {
    const response = await axiosInstance.get(`/kitchen-tickets/${id}`);
    return response.data.data?.tickets || response.data.data || [];
  },

  updateTicketStage: async (id: string, stage: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(`/kitchen-tickets/${id}/status`, { stage });
    return response.data.data?.tickets || response.data.data || [];
  },

  updateItemStatus: async (ticketId: string, itemId: string, status: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(
      `/kitchen-tickets/${ticketId}/items/${itemId}/status`,
      { status }
    );
    return response.data.data?.tickets || response.data.data || [];
  },

  mockGetAll: async (): Promise<KdsTicket[]> => {
    return kdsService.getTickets();
  },

  updateStage: async (id: string, stage: string): Promise<KdsTicket> => {
    return kdsService.updateTicketStage(id, stage);
  },

  mockGetTickets: async (): Promise<KdsTicket[]> => {
    return kdsService.getTickets();
  },
};
