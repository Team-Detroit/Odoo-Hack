"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class OrderRepository {
    async getAllOrders() {
        return prisma_1.default.order.findMany({
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
    }
    async getOrderById(id) {
        return prisma_1.default.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                customer: true,
                table: true
            }
        });
    }
    async createOrder(data) {
        const { items, ...orderData } = data;
        const order = await prisma_1.default.order.create({
            data: {
                ...orderData,
                items: {
                    create: (items || []).map((i) => ({
                        productId: i.productId,
                        quantity: Number(i.quantity),
                        price: Number(i.price),
                        total: Number(i.quantity) * Number(i.price)
                    }))
                }
            },
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
        if (orderData.tableId) {
            try {
                await prisma_1.default.table.update({
                    where: { id: orderData.tableId },
                    data: { status: 'OCCUPIED' }
                });
            }
            catch (err) {
                console.error("Failed to automatically set table as OCCUPIED:", err);
            }
        }
        return order;
    }
    async updateOrder(id, data) {
        const updatedOrder = await prisma_1.default.order.update({
            where: { id },
            data,
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
        if (data.status === 'PAID' || data.status === 'SENT_TO_KITCHEN') {
            try {
                if (data.status === 'PAID' && updatedOrder.tableId) {
                    // If self-ordering, keep the table occupied. Otherwise free it.
                    await prisma_1.default.table.update({
                        where: { id: updatedOrder.tableId },
                        data: { status: updatedOrder.selfOrder ? 'OCCUPIED' : 'AVAILABLE' }
                    });
                }
                else if (data.status === 'SENT_TO_KITCHEN' && updatedOrder.tableId) {
                    await prisma_1.default.table.update({
                        where: { id: updatedOrder.tableId },
                        data: { status: 'OCCUPIED' }
                    });
                }
                await prisma_1.default.kitchenTicket.upsert({
                    where: { orderId: id },
                    update: { status: 'TO_COOK' },
                    create: { orderId: id, status: 'TO_COOK' }
                });
            }
            catch (err) {
                console.error("Error updating table or kitchen ticket status on order status change:", err);
            }
        }
        return updatedOrder;
    }
    async deleteOrder(id) {
        return prisma_1.default.order.delete({ where: { id } });
    }
    async sendToKitchen(id) {
        try {
            await prisma_1.default.kitchenTicket.upsert({
                where: { orderId: id },
                update: { status: 'TO_COOK' },
                create: { orderId: id, status: 'TO_COOK' }
            });
        }
        catch (err) {
            console.error("Error creating kitchen ticket on sendToKitchen:", err);
        }
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'SENT_TO_KITCHEN' },
            include: {
                items: true,
                customer: true,
                table: true
            },
        });
    }
    async cancelOrder(id) {
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                items: true,
                customer: true,
                table: true
            },
        });
    }
}
exports.OrderRepository = OrderRepository;
