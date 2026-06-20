export type KdsStage = 'to_cook' | 'preparing' | 'completed';

export interface KdsTicketItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  specialInstructions?: string;
  status: KdsStage;
}

export interface KdsTicket {
  id: string;
  ticketNumber: string;
  orderNumber: string;
  tableNumber?: string;
  customerName?: string;
  items: KdsTicketItem[];
  stage: KdsStage;
  createdAt: string;
  updatedAt: string;
}

export interface KdsFilter {
  searchTerm?: string;
  product?: string;
  category?: string;
  stage?: KdsStage;
}
