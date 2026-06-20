import { CreateOrderDto } from './createOrder.dto';

export interface UpdateOrderDto extends Partial<CreateOrderDto> {}
