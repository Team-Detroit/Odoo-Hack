import { OrderStatus } from '@prisma/client';
import { CreateOrderDto } from './createOrder.dto';

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  status?: OrderStatus;
}
