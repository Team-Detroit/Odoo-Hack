import axiosInstance from '../lib/axios';
import { Table, CreateTableRequest, UpdateTableRequest } from '../types/table';

export const mapTableFromDb = (dbTable: any): Table => {
  if (!dbTable) return dbTable;
  return {
    ...dbTable,
    tableNumber: dbTable.number ?? dbTable.tableNumber ?? 1,
    numberOfSeats: dbTable.seats ?? dbTable.numberOfSeats ?? 2,
    isOutOfService: dbTable.isOutOfService ?? (dbTable.status === 'MAINTENANCE'),
  };
};

export const mapTableToDb = (tableData: any) => {
  if (!tableData) return tableData;
  const result: any = {};
  if (tableData.tableNumber !== undefined) result.number = Number(tableData.tableNumber);
  if (tableData.numberOfSeats !== undefined) result.seats = Number(tableData.numberOfSeats);
  if (tableData.isOutOfService !== undefined) result.status = tableData.isOutOfService ? 'MAINTENANCE' : 'AVAILABLE';
  if (tableData.floorId !== undefined) result.floorId = tableData.floorId;
  if (tableData.x !== undefined) result.x = tableData.x != null ? Number(tableData.x) : null;
  if (tableData.y !== undefined) result.y = tableData.y != null ? Number(tableData.y) : null;
  if (tableData.width !== undefined) result.width = tableData.width != null ? Number(tableData.width) : null;
  if (tableData.height !== undefined) result.height = tableData.height != null ? Number(tableData.height) : null;
  if (tableData.shape !== undefined) result.shape = tableData.shape;
  return result;
};

export const tableService = {
  getAll: async (): Promise<Table[]> => {
    const response = await axiosInstance.get('/tables');
    const list = response.data.data?.tables || response.data.data || [];
    return Array.isArray(list) ? list.map(mapTableFromDb) : [];
  },

  getByFloor: async (floorId: string): Promise<Table[]> => {
    const response = await axiosInstance.get(`/tables?floorId=${floorId}`);
    const list = response.data.data?.tables || response.data.data || [];
    return Array.isArray(list) ? list.map(mapTableFromDb) : [];
  },

  getById: async (id: string): Promise<Table> => {
    const response = await axiosInstance.get(`/tables/${id}`);
    const item = response.data.data?.table || response.data.data?.tables || response.data.data || response.data;
    return mapTableFromDb(item);
  },

  create: async (data: CreateTableRequest): Promise<Table> => {
    const mapped = mapTableToDb(data);
    const response = await axiosInstance.post('/tables', mapped);
    const item = response.data.data?.table || response.data.data?.tables || response.data.data || response.data;
    return mapTableFromDb(item);
  },

  update: async (id: string, data: Partial<CreateTableRequest>): Promise<Table> => {
    const mapped = mapTableToDb(data);
    const response = await axiosInstance.put(`/tables/${id}`, mapped);
    const item = response.data.data?.table || response.data.data?.tables || response.data.data || response.data;
    return mapTableFromDb(item);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tables/${id}`);
  },

  updateStatus: async (id: string, status: string): Promise<Table> => {
    const response = await axiosInstance.patch(`/tables/${id}/status`, { status });
    const item = response.data.data?.table || response.data.data || response.data;
    return mapTableFromDb(item);
  },

  mockGetByFloor: async (): Promise<Table[]> => {
    return tableService.getAll();
  },
};
