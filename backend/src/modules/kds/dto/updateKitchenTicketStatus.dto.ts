import { KitchenStatus } from '@prisma/client';

export interface UpdateKitchenTicketStatusDto {
  status: KitchenStatus;
}

