export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  isActive: boolean;
  maxUsageCount?: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCouponRequest {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUsageCount?: number;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {
  id: string;
}
