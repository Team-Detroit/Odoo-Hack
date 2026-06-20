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
  description?: string;
  expiryDate?: string;
  minPurchase?: number;
  minOrders?: number;
  monthsActive?: number;
  newCustomerOnly?: boolean;
}

export interface CreateCouponRequest {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  maxUsageCount?: number;
  description?: string;
  expiryDate?: string;
  minPurchase?: number;
  minOrders?: number;
  monthsActive?: number;
  newCustomerOnly?: boolean;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {
  id: string;
}
