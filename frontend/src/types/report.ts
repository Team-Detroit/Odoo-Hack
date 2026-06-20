export interface ReportFilter {
  period: 'today' | 'week' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  employeeId?: string;
  sessionId?: string;
  productId?: string;
}

export interface ReportMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
}

export interface SalesTrend {
  date: string;
  amount: number;
  orderCount: number;
}

export interface CategorySale {
  categoryId: string;
  categoryName: string;
  totalSales: number;
  quantity: number;
}

export interface ProductSale {
  productId: string;
  productName: string;
  quantity: number;
  totalSales: number;
}

export interface TopOrder {
  orderId: string;
  orderNumber: string;
  total: number;
  itemCount: number;
  date: string;
}

export interface Report {
  metrics: ReportMetrics;
  salesTrends: SalesTrend[];
  topCategories: CategorySale[];
  topProducts: ProductSale[];
  topOrders: TopOrder[];
}
