import { Customer } from './customer';
import { Product } from './product';
import { Table } from './table';

export type OrderStatus = 'draft' | 'paid' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  discountAmount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableId?: string;
  table?: Table;
  customerId?: string;
  customer?: Customer;
  sessionId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  selfOrder?: boolean;
  paymentTag?: string;
  offerTag?: string;
  couponCode?: string;
  appliedPromotion?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  tableId?: string;
  customerId?: string;
  sessionId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  couponCode?: string;
}

export interface UpdateOrderRequest extends Partial<CreateOrderRequest> {
  id: string;
}
