"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class OrderRepository {
    async getAllOrders() {
        return prisma_1.default.order.findMany({ include: { items: true } });
    }
    async getOrderById(id) {
        return prisma_1.default.order.findUnique({ where: { id }, include: { items: true } });
    }
    async createOrder(data) {
        return prisma_1.default.order.create({ data, include: { items: true } });
    }
    async updateOrder(id, data) {
        return prisma_1.default.order.update({ where: { id }, data, include: { items: true } });
    }
    async deleteOrder(id) {
        return prisma_1.default.order.delete({ where: { id } });
    }
    async sendToKitchen(id) {
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'SENT_TO_KITCHEN' },
            include: { items: true },
        });
    }
    async cancelOrder(id) {
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: { items: true },
        });
    }
}
exports.OrderRepository = OrderRepository;
