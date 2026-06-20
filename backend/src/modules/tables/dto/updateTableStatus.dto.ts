import { TableStatus } from '@prisma/client';

export interface UpdateTableStatusDto {
  status: TableStatus;
}
