import prisma from '../../../shared/prisma';

export class ReportsRepository {
  async getDashboardMetrics() {
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.payment.aggregate({ _sum: { amount: true } });
    const totalProducts = await prisma.product.count();
    const totalCustomers = await prisma.customer.count();

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalProducts,
      totalCustomers,
    };
  }

  async getSalesMetrics() {
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async getTopProducts(limit: number = 10) {
    const orderItems = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit,
    });

    const topProducts = await Promise.all(
      orderItems.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return { product, totalQuantity: item._sum.quantity };
      })
    );

    return topProducts;
  }

  async getTopCategories(limit: number = 10) {
    const categories = await prisma.category.findMany({ take: limit });
    return categories;
  }

  async getRevenueMetrics() {
    const payments = await prisma.payment.groupBy({
      by: ['status'],
      _sum: { amount: true },
      _count: true,
    });

    return payments;
  }
}
