import { create } from 'zustand';
import { CartItem, CartTotal } from '../types/cart';
import { Product } from '../types/product';
import { calculateCartTotals } from '../utils/calculateCartTotals';

interface CartStore {
  items: CartItem[];
  couponCode: string;
  customerId: string;
  tableId: string;
  totals: CartTotal;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  setCoupon: (code: string) => void;
  setCustomer: (id: string) => void;
  setTable: (id: string) => void;
  clearCart: () => void;
  discountAmount: number;
  setDiscount: (amount: number) => void;
}

const emptyTotals: CartTotal = { subtotal: 0, tax: 0, discountAmount: 0, total: 0 };

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  couponCode: '',
  customerId: '',
  tableId: '',
  totals: emptyTotals,
  discountAmount: 0,

  addItem: (product) => {
    const items = get().items;
    const existing = items.find((i) => i.productId === product.id);
    const updated = existing
      ? items.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...items, { productId: product.id, product, quantity: 1, unitPrice: product.price }];
    set({ items: updated, totals: calculateCartTotals(updated, 0, get().discountAmount) });
  },

  removeItem: (productId) => {
    const updated = get().items.filter((i) => i.productId !== productId);
    set({ items: updated, totals: calculateCartTotals(updated, 0, get().discountAmount) });
  },

  updateQty: (productId, quantity) => {
    if (quantity <= 0) { get().removeItem(productId); return; }
    const updated = get().items.map((i) => i.productId === productId ? { ...i, quantity } : i);
    set({ items: updated, totals: calculateCartTotals(updated, 0, get().discountAmount) });
  },

  setCoupon: (code) => set({ couponCode: code }),
  setCustomer: (id) => set({ customerId: id }),
  setTable: (id) => set({ tableId: id }),
  setDiscount: (amount) => {
    const items = get().items;
    set({ discountAmount: amount, totals: calculateCartTotals(items, 0, amount) });
  },

  clearCart: () => set({ items: [], couponCode: '', customerId: '', tableId: '', totals: emptyTotals, discountAmount: 0 }),
}));
