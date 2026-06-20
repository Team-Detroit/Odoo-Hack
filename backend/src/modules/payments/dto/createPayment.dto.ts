import { PaymentMethod } from '@prisma/client';

export interface CreatePaymentDto {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}
