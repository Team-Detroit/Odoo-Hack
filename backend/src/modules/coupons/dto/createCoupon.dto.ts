export interface CreateCouponDto {
  code: string;
  discount: number;
  active?: boolean;
}
