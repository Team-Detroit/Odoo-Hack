export type PromotionType = 'product' | 'order';
export type DiscountType = 'percentage' | 'fixed';

export interface Promotion {
  id: string;
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  
  // For product-based promos
  productId?: string;
  minProductQuantity?: number;
  
  // For order-based promos
  minOrderAmount?: number;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionRequest {
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  productId?: string;
  minProductQuantity?: number;
  minOrderAmount?: number;
}

export interface UpdatePromotionRequest extends Partial<CreatePromotionRequest> {
  id: string;
}
