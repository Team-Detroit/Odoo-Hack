import axiosInstance from '../lib/axios';
import { KdsTicket, KdsFilter, KdsStage } from '../types/kds';

const mapKdsTicket = (t: any): KdsTicket => {
  if (!t) return t;
  const order = t.order || {};
  return {
    id: t.id,
    ticketNumber: t.id.substring(0, 8).toUpperCase(),
    orderNumber: order.id ? order.id.substring(0, 8).toUpperCase() : '',
    tableNumber: order.table ? String(order.table.tableNumber ?? order.table.number ?? '') : '',
    customerName: order.customer ? order.customer.name : '',
    stage: (t.status || 'TO_COOK').toLowerCase() as KdsStage,
    selfOrder: order.selfOrder || false,
    paymentTag: order.paymentTag || '',
    items: (order.items || []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name ?? 'Product Item',
      quantity: item.quantity,
      status: (t.status || 'TO_COOK').toLowerCase() as KdsStage,
    })),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: t.updatedAt || new Date().toISOString(),
  };
};

export const kdsService = {
  getTickets: async (filter?: KdsFilter): Promise<KdsTicket[]> => {
    const params = new URLSearchParams();
    if (filter?.stage) params.append('stage', filter.stage);
    if (filter?.searchTerm) params.append('search', filter.searchTerm);
    
    const response = await axiosInstance.get(`/kitchen-tickets?${params.toString()}`);
    const list = response.data.data?.tickets || response.data.data || [];
    return Array.isArray(list) ? list.map(mapKdsTicket) : [];
  },

  getTicketById: async (id: string): Promise<KdsTicket> => {
    const response = await axiosInstance.get(`/kitchen-tickets/${id}`);
    const item = response.data.data?.ticket || response.data.data || response.data;
    return mapKdsTicket(item);
  },

  updateTicketStage: async (id: string, stage: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(`/kitchen-tickets/${id}/status`, { status: stage });
    const item = response.data.data?.ticket || response.data.data || response.data;
    return mapKdsTicket(item);
  },

  updateItemStatus: async (ticketId: string, itemId: string, status: string): Promise<KdsTicket> => {
    const response = await axiosInstance.patch(
      `/kitchen-tickets/${ticketId}/items/${itemId}/status`,
      { status }
    );
    const item = response.data.data?.ticket || response.data.data || response.data;
    return mapKdsTicket(item);
  },

  mockGetAll: async (): Promise<KdsTicket[]> => {
    return kdsService.getTickets();
  },

  updateStage: async (id: string, stage: string): Promise<KdsTicket> => {
    return kdsService.updateTicketStage(id, stage);
  },

  deleteTicket: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/kitchen-tickets/${id}`);
  },

  mockGetTickets: async (): Promise<KdsTicket[]> => {
    return kdsService.getTickets();
  },
};
