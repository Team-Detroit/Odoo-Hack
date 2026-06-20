export interface CreateCouponDto {
  code: string;
  discountType: string;
  discountValue: number;
  active?: boolean;
  description?: string;
  expiryDate?: string;
  minPurchase?: number;
  minOrders?: number;
  monthsActive?: number;
  newCustomerOnly?: boolean;
}
