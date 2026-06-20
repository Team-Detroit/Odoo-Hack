import { OrderStatus } from '@prisma/client';

export interface CreateOrderDto {
  sessionId: string;
  tableId: string;
  customerId?: string;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
}
