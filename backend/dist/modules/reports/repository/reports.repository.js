"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class ReportsRepository {
    async getDashboardMetrics() {
        const totalOrders = await prisma_1.default.order.count();
        const totalRevenue = await prisma_1.default.payment.aggregate({ _sum: { amount: true } });
        const totalProducts = await prisma_1.default.product.count();
        const totalCustomers = await prisma_1.default.customer.count();
        return {
            totalOrders,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalProducts,
            totalCustomers,
        };
    }
    async getSalesMetrics() {
        const orders = await prisma_1.default.order.findMany({
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        });
        return orders;
    }
    async getTopProducts(limit = 10) {
        const orderItems = await prisma_1.default.orderItem.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: limit,
        });
        const topProducts = await Promise.all(orderItems.map(async (item) => {
            const product = await prisma_1.default.product.findUnique({ where: { id: item.productId } });
            return { product, totalQuantity: item._sum.quantity };
        }));
        return topProducts;
    }
    async getTopCategories(limit = 10) {
        const categories = await prisma_1.default.category.findMany({ take: limit });
        return categories;
    }
    async getRevenueMetrics() {
        const payments = await prisma_1.default.payment.groupBy({
            by: ['status'],
            _sum: { amount: true },
            _count: true,
        });
        return payments;
    }
}
exports.ReportsRepository = ReportsRepository;
