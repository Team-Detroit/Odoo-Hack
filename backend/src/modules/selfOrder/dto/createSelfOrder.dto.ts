export interface CreateSelfOrderDto {
  token: string;
  items: Array<{ productId: string; quantity: number }>;
}
