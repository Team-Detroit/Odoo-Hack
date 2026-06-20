"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const reports_service_1 = require("../service/reports.service");
const response_util_1 = require("../../../shared/utils/response.util");
class ReportsController {
    reportsService = new reports_service_1.ReportsService();
    async getDashboard(req, res) {
        try {
            const metrics = await this.reportsService.getDashboardMetrics();
            res.status(200).json((0, response_util_1.successResponse)('Dashboard metrics fetched successfully', { metrics }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch dashboard metrics', error.message));
        }
    }
    async getSales(req, res) {
        try {
            const sales = await this.reportsService.getSalesMetrics();
            res.status(200).json((0, response_util_1.successResponse)('Sales metrics fetched successfully', { sales }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch sales metrics', error.message));
        }
    }
    async getTopProducts(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const topProducts = await this.reportsService.getTopProducts(limit);
            res.status(200).json((0, response_util_1.successResponse)('Top products fetched successfully', { topProducts }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch top products', error.message));
        }
    }
    async getTopCategories(req, res) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const topCategories = await this.reportsService.getTopCategories(limit);
            res.status(200).json((0, response_util_1.successResponse)('Top categories fetched successfully', { topCategories }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch top categories', error.message));
        }
    }
    async getRevenue(req, res) {
        try {
            const revenue = await this.reportsService.getRevenueMetrics();
            res.status(200).json((0, response_util_1.successResponse)('Revenue metrics fetched successfully', { revenue }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch revenue metrics', error.message));
        }
    }
}
exports.ReportsController = ReportsController;
