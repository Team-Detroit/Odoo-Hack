import { TableStatus } from '@prisma/client';

export interface CreateTableDto {
  number: number;
  seats: number;
  status?: TableStatus;
  floorId: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: string;
}
