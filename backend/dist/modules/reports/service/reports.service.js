"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const reports_repository_1 = require("../repository/reports.repository");
class ReportsService {
    reportsRepository = new reports_repository_1.ReportsRepository();
    async getDashboardMetrics() {
        return this.reportsRepository.getDashboardMetrics();
    }
    async getSalesMetrics() {
        return this.reportsRepository.getSalesMetrics();
    }
    async getTopProducts(limit = 10) {
        return this.reportsRepository.getTopProducts(limit);
    }
    async getTopCategories(limit = 10) {
        return this.reportsRepository.getTopCategories(limit);
    }
    async getRevenueMetrics() {
        return this.reportsRepository.getRevenueMetrics();
    }
}
exports.ReportsService = ReportsService;
