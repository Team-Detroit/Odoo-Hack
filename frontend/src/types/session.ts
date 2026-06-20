export interface Session {
  id: string;
  employeeId: string;
  openedAt: string;
  closedAt?: string;
  openingBalance: number;
  closingBalance?: number;
  totalSales: number;
  totalOrders: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSessionRequest {
  employeeId: string;
  openingBalance: number;
}

export interface CloseSessionRequest {
  sessionId: string;
  closingBalance: number;
}
