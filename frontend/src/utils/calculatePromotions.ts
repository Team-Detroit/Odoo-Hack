import { Promotion } from '../types/promotion';
import { CartItem } from '../types/cart';

export interface ApplicablePromotion {
  promotionId: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  type: 'product' | 'order';
}

export interface PromotionResult {
  applicablePromotions: ApplicablePromotion[];
  totalDiscountAmount: number;
}

export const calculateApplicablePromotions = (
  cart: CartItem[],
  promotions: Promotion[]
): PromotionResult => {
  const applicablePromotions: ApplicablePromotion[] = [];
  let totalDiscountAmount = 0;

  // Filter active promotions only
  const activePromotions = promotions.filter((p) => p.isActive);

  for (const promo of activePromotions) {
    if (promo.type === 'product' && promo.productId && promo.minProductQuantity) {
      // Check if cart has enough quantity of the product
      const cartItem = cart.find((item) => item.productId === promo.productId);
      if (cartItem && cartItem.quantity >= promo.minProductQuantity) {
        // Calculate discount on whole order
        const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        let discountAmount = 0;

        if (promo.discountType === 'percentage') {
          discountAmount = (subtotal * promo.discountValue) / 100;
        } else {
          discountAmount = promo.discountValue;
        }

        applicablePromotions.push({
          promotionId: promo.id,
          name: promo.name,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          type: 'product',
        });

        totalDiscountAmount += discountAmount;
      }
    } else if (promo.type === 'order' && promo.minOrderAmount) {
      // Check if cart total meets minimum order amount
      const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

      if (subtotal >= promo.minOrderAmount) {
        let discountAmount = 0;

        if (promo.discountType === 'percentage') {
          discountAmount = (subtotal * promo.discountValue) / 100;
        } else {
          discountAmount = promo.discountValue;
        }

        applicablePromotions.push({
          promotionId: promo.id,
          name: promo.name,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          type: 'order',
        });

        totalDiscountAmount += discountAmount;
      }
    }
  }

  return {
    applicablePromotions,
    totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
  };
};

export const getPromotionDiscount = (promo: Promotion, cartSubtotal: number): number => {
  if (promo.discountType === 'percentage') {
    return (cartSubtotal * promo.discountValue) / 100;
  } else {
    return promo.discountValue;
  }
};
