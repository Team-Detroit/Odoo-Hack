"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfOrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class SelfOrderRepository {
    async getMenuByToken(token) {
        const selfOrderToken = await prisma_1.default.selfOrderToken.findUnique({ where: { token } });
        if (!selfOrderToken)
            return null;
        return prisma_1.default.product.findMany();
    }
    async createOrderByToken(token, items) {
        const selfOrderToken = await prisma_1.default.selfOrderToken.findUnique({
            where: { token },
            include: { table: { include: { orders: { where: { status: { notIn: ['PAID', 'CANCELLED'] } } } } } },
        });
        if (!selfOrderToken)
            return null;
        // Get the active session for this table
        const session = await prisma_1.default.session.findFirst({
            where: { status: 'OPEN' },
            orderBy: { openedAt: 'desc' },
            take: 1,
        });
        if (!session)
            return null;
        let total = 0;
        for (const item of items) {
            const product = await prisma_1.default.product.findUnique({ where: { id: item.productId } });
            if (product)
                total += product.price * item.quantity;
        }
        const order = await prisma_1.default.order.create({
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
            const product = await prisma_1.default.product.findUnique({ where: { id: item.productId } });
            const itemTotal = (product?.price || 0) * item.quantity;
            await prisma_1.default.orderItem.create({
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
    async getOrderStatusByToken(token) {
        const selfOrderToken = await prisma_1.default.selfOrderToken.findUnique({ where: { token } });
        if (!selfOrderToken)
            return null;
        return prisma_1.default.order.findFirst({
            where: { tableId: selfOrderToken.tableId },
            include: { items: true },
        });
    }
}
exports.SelfOrderRepository = SelfOrderRepository;
