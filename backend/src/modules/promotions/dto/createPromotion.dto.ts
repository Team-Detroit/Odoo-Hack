export interface CreatePromotionDto {
  name: string;
  description?: string;
  type: string;
  discountType: string;
  discountValue: number;
  productId?: string;
  minProductQuantity?: number;
  minOrderAmount?: number;
  active?: boolean;
}
