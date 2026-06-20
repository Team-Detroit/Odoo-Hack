"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemService = void 0;
const client_1 = require("@prisma/client");
const orderItem_repository_1 = require("../repository/orderItem.repository");
class OrderItemService {
    orderItemRepository = new orderItem_repository_1.OrderItemRepository();
    async getOrderItemsByOrderId(orderId) {
        return this.orderItemRepository.getOrderItemsByOrderId(orderId);
    }
    async getOrderItemById(id) {
        return this.orderItemRepository.getOrderItemById(id);
    }
    async createOrderItem(data) {
        return this.orderItemRepository.createOrderItem(data);
    }
    async updateOrderItem(id, data) {
        try {
            return await this.orderItemRepository.updateOrderItem(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteOrderItem(id) {
        try {
            return await this.orderItemRepository.deleteOrderItem(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.OrderItemService = OrderItemService;
