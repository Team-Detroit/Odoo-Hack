import { Table } from './table';

export interface Floor {
  id: string;
  name: string;
  isActive: boolean;
  tables: Table[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFloorRequest {
  name: string;
}

export interface UpdateFloorRequest extends Partial<CreateFloorRequest> {
  id: string;
}
