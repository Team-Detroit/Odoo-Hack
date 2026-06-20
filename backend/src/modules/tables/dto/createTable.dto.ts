import { TableStatus } from '@prisma/client';

export interface CreateTableDto {
  number: number;
  seats: number;
  status?: TableStatus;
  floorId: string;
}
