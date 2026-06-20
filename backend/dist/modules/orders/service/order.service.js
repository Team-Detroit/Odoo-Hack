"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const order_repository_1 = require("../repository/order.repository");
class OrderService {
    orderRepository = new order_repository_1.OrderRepository();
    async getAllOrders() {
        return this.orderRepository.getAllOrders();
    }
    async getOrderById(id) {
        return this.orderRepository.getOrderById(id);
    }
    async createOrder(data) {
        return this.orderRepository.createOrder(data);
    }
    async updateOrder(id, data) {
        try {
            return await this.orderRepository.updateOrder(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteOrder(id) {
        try {
            return await this.orderRepository.deleteOrder(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async sendToKitchen(id) {
        try {
            return await this.orderRepository.sendToKitchen(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async cancelOrder(id) {
        try {
            return await this.orderRepository.cancelOrder(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.OrderService = OrderService;
