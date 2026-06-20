export interface CreatePromotionDto {
  name: string;
  description?: string;
  discount: number;
  active?: boolean;
}
