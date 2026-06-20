export interface CreateCouponDto {
  code: string;
  discountType: string;
  discountValue: number;
  active?: boolean;
}
