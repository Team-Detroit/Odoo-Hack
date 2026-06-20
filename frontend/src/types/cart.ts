import { Product } from './product';

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface CartTotal {
  subtotal: number;
  tax: number;
  discountAmount: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  appliedPromotions: string[]; // promotion IDs
  customerId?: string;
  tableId?: string;
  totals: CartTotal;
}
