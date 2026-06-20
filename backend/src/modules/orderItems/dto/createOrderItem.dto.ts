export interface CreateOrderItemDto {
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  total: number;
}
