export interface Table {
  id: string;
  floorId: string;
  tableNumber: number;
  numberOfSeats: number;
  isActive: boolean;
  hasActiveOrder: boolean;
  isOutOfService?: boolean;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  pendingItemsCount?: number;
  currentTotal?: number;
  x?: number; // Position percentage X
  y?: number; // Position percentage Y
  width?: number; // Size width percentage or px
  height?: number; // Size height percentage or px
  shape?: 'square' | 'rectangle' | 'round';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTableRequest {
  floorId: string;
  tableNumber: number;
  numberOfSeats: number;
  isOutOfService?: boolean;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  shape?: 'square' | 'rectangle' | 'round';
}

export interface UpdateTableRequest extends Partial<CreateTableRequest> {
  id: string;
}

