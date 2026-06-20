export interface Table {
  id: string;
  floorId: string;
  tableNumber: number;
  numberOfSeats: number;
  isActive: boolean;
  hasActiveOrder: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  floorId: string;
  tableNumber: number;
  numberOfSeats: number;
}

export interface UpdateTableRequest extends Partial<CreateTableRequest> {
  id: string;
}
