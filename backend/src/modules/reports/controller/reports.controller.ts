import { Request, Response } from 'express';
import { ReportsService } from '../service/reports.service';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class ReportsController {
  private reportsService = new ReportsService();

  async getDashboard(req: Request, res: Response) {
    try {
      const metrics = await this.reportsService.getDashboardMetrics();
      res.status(200).json(successResponse('Dashboard metrics fetched successfully', { metrics }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch dashboard metrics', error.message));
    }
  }

  async getSales(req: Request, res: Response) {
    try {
      const sales = await this.reportsService.getSalesMetrics();
      res.status(200).json(successResponse('Sales metrics fetched successfully', { sales }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch sales metrics', error.message));
    }
  }

  async getTopProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const topProducts = await this.reportsService.getTopProducts(limit);
      res.status(200).json(successResponse('Top products fetched successfully', { topProducts }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch top products', error.message));
    }
  }

  async getTopCategories(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const topCategories = await this.reportsService.getTopCategories(limit);
      res.status(200).json(successResponse('Top categories fetched successfully', { topCategories }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch top categories', error.message));
    }
  }

  async getRevenue(req: Request, res: Response) {
    try {
      const revenue = await this.reportsService.getRevenueMetrics();
      res.status(200).json(successResponse('Revenue metrics fetched successfully', { revenue }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch revenue metrics', error.message));
    }
  }
}
