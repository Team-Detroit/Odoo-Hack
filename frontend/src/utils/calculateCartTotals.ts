import { CartItem } from '../types/cart';

export interface CartCalculation {
  subtotal: number;
  tax: number;
  discountAmount: number;
  total: number;
}

export const calculateCartTotals = (
  items: CartItem[],
  discountPercentage: number = 0,
  discountAmount: number = 0
): CartCalculation => {
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  // Apply discount (either percentage or fixed amount)
  let appliedDiscount = 0;
  if (discountPercentage > 0) {
    appliedDiscount = (subtotal * discountPercentage) / 100;
  } else if (discountAmount > 0) {
    appliedDiscount = Math.min(discountAmount, subtotal);
  }

  const discountedSubtotal = subtotal - appliedDiscount;

  // Calculate tax on discounted amount
  // Tax is calculated on each item individually, then summed
  const tax = items.reduce((sum, item) => {
    const itemSubtotal = item.unitPrice * item.quantity;
    const itemDiscount = (itemSubtotal / subtotal) * appliedDiscount;
    const taxableAmount = itemSubtotal - itemDiscount;
    // Assuming tax is stored as percentage in product
    return sum + (taxableAmount * (item.product.tax || 0)) / 100;
  }, 0);

  const total = discountedSubtotal + tax;

  return {
    subtotal,
    tax: Math.round(tax * 100) / 100,
    discountAmount: Math.round(appliedDiscount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const calculateLineTotal = (
  unitPrice: number,
  quantity: number,
  taxPercentage: number = 0
): number => {
  const subtotal = unitPrice * quantity;
  const tax = (subtotal * taxPercentage) / 100;
  return Math.round((subtotal + tax) * 100) / 100;
};
