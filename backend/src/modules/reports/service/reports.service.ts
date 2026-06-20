import { ReportsRepository } from '../repository/reports.repository';

export class ReportsService {
  private reportsRepository = new ReportsRepository();

  async getDashboardMetrics() {
    return this.reportsRepository.getDashboardMetrics();
  }

  async getSalesMetrics() {
    return this.reportsRepository.getSalesMetrics();
  }

  async getTopProducts(limit: number = 10) {
    return this.reportsRepository.getTopProducts(limit);
  }

  async getTopCategories(limit: number = 10) {
    return this.reportsRepository.getTopCategories(limit);
  }

  async getRevenueMetrics() {
    return this.reportsRepository.getRevenueMetrics();
  }
}
