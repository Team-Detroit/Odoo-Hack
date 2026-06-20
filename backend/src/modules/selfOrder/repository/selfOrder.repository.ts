import prisma from '../../../shared/prisma';

export class SelfOrderRepository {
  async getMenuByToken(token: string) {
    const selfOrderToken = await prisma.selfOrderToken.findUnique({ where: { token } });
    if (!selfOrderToken) return null;
    return prisma.product.findMany();
  }

  async createOrderByToken(token: string, items: Array<{ productId: string; quantity: number }>) {
    const selfOrderToken = await prisma.selfOrderToken.findUnique({
      where: { token },
      include: { table: { include: { orders: { where: { status: { notIn: ['PAID', 'CANCELLED'] } } } } } },
    });
    if (!selfOrderToken) return null;

    // Get the active session for this table
    const session = await prisma.session.findFirst({
      where: { status: 'OPEN' },
      orderBy: { openedAt: 'desc' },
      take: 1,
    });
    if (!session) return null;

    let total = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (product) total += product.price * item.quantity;
    }

    const order = await prisma.order.create({
      data: {
        sessionId: session.id,
        tableId: selfOrderToken.tableId,
        subtotal: total,
        tax: 0,
        total: total,
      },
      include: { items: true },
    });

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      const itemTotal = (product?.price || 0) * item.quantity;
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: product?.price || 0,
          total: itemTotal,
        },
      });
    }

    return order;
  }

  async getOrderStatusByToken(token: string) {
    const selfOrderToken = await prisma.selfOrderToken.findUnique({ where: { token } });
    if (!selfOrderToken) return null;
    return prisma.order.findFirst({
      where: { tableId: selfOrderToken.tableId },
      include: { items: true },
    });
  }
}
