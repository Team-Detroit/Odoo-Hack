"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class OrderItemRepository {
    async getOrderItemsByOrderId(orderId) {
        return prisma_1.default.orderItem.findMany({ where: { orderId } });
    }
    async getOrderItemById(id) {
        return prisma_1.default.orderItem.findUnique({ where: { id } });
    }
    async createOrderItem(data) {
        return prisma_1.default.orderItem.create({ data });
    }
    async updateOrderItem(id, data) {
        return prisma_1.default.orderItem.update({ where: { id }, data });
    }
    async deleteOrderItem(id) {
        return prisma_1.default.orderItem.delete({ where: { id } });
    }
}
exports.OrderItemRepository = OrderItemRepository;
