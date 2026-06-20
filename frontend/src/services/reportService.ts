import axiosInstance from '../lib/axios';
import { Report, ReportFilter, ReportMetrics } from '../types/report';

export const reportService = {
  getReport: async (filter: ReportFilter): Promise<Report> => {
    const params = new URLSearchParams();
    params.append('period', filter.period);
    if (filter.startDate) params.append('startDate', filter.startDate);
    if (filter.endDate) params.append('endDate', filter.endDate);
    if (filter.employeeId) params.append('employeeId', filter.employeeId);
    if (filter.sessionId) params.append('sessionId', filter.sessionId);
    if (filter.productId) params.append('productId', filter.productId);

    const response = await axiosInstance.get(`/reports?${params.toString()}`);
    return response.data;
  },

  getMetrics: async (filter: ReportFilter): Promise<ReportMetrics> => {
    const response = await axiosInstance.post('/reports/metrics', filter);
    return response.data;
  },

  exportPDF: async (filter: ReportFilter): Promise<Blob> => {
    const response = await axiosInstance.post('/reports/export/pdf', filter, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportXLS: async (filter: ReportFilter): Promise<Blob> => {
    const response = await axiosInstance.post('/reports/export/xls', filter, {
      responseType: 'blob',
    });
    return response.data;
  },

  mockGetReport: async (): Promise<Report> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          metrics: {
            totalOrders: 12,
            totalRevenue: 5400,
            averageOrderValue: 450,
            totalCustomers: 8,
          },
          salesTrends: [
            { date: '2024-01-01', amount: 500, orderCount: 2 },
            { date: '2024-01-02', amount: 800, orderCount: 3 },
          ],
          topCategories: [
            { categoryId: '1', categoryName: 'Beverages', totalSales: 1200, quantity: 15 },
          ],
          topProducts: [
            { productId: '1', productName: 'Coffee', quantity: 10, totalSales: 1000 },
          ],
          topOrders: [
            { orderId: '1', orderNumber: 'ORD-001', total: 500, itemCount: 3, date: '2024-01-01' },
          ],
        });
      }, 300);
    });
  },
};
