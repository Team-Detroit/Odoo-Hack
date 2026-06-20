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
    const dashboardRes = await axiosInstance.get('/reports/dashboard');
    const salesRes = await axiosInstance.get('/reports/sales');
    const topProductsRes = await axiosInstance.get('/reports/top-products');
    const topCategoriesRes = await axiosInstance.get('/reports/top-categories');
    
    const dashboardMetrics = dashboardRes.data.data?.metrics || {};
    const salesList = salesRes.data.data?.sales || [];
    const topProdList = topProductsRes.data.data?.topProducts || [];
    const topCatList = topCategoriesRes.data.data?.topCategories || [];

    return {
      metrics: {
        totalOrders: dashboardMetrics.totalOrders || 0,
        totalRevenue: dashboardMetrics.totalRevenue || 0,
        averageOrderValue: dashboardMetrics.totalOrders > 0 
          ? dashboardMetrics.totalRevenue / dashboardMetrics.totalOrders 
          : 0,
        totalCustomers: dashboardMetrics.totalCustomers || 0,
      },
      salesTrends: salesList.map((o) => ({
        date: new Date(o.createdAt).toLocaleDateString(),
        amount: o.total,
        orderCount: 1
      })),
      topCategories: topCatList.map((c) => ({
        categoryId: c.id,
        categoryName: c.name,
        totalSales: 0,
        quantity: 0
      })),
      topProducts: topProdList.map((p) => ({
        productId: p.product.id,
        productName: p.product.name,
        quantity: p.totalQuantity,
        totalSales: p.totalQuantity * p.product.price
      })),
      topOrders: salesList.slice(0, 5).map((o) => ({
        orderId: o.id,
        orderNumber: o.id.slice(0, 8),
        total: o.total,
        itemCount: o.items ? o.items.length : 0,
        date: new Date(o.createdAt).toLocaleDateString()
      }))
    };
  },
};
