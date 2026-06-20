"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const client_1 = require("@prisma/client");
const payment_repository_1 = require("../repository/payment.repository");
class PaymentService {
    paymentRepository = new payment_repository_1.PaymentRepository();
    async getPaymentsByOrderId(orderId) {
        return this.paymentRepository.getPaymentsByOrderId(orderId);
    }
    async getPaymentById(id) {
        return this.paymentRepository.getPaymentById(id);
    }
    async createPayment(data) {
        return this.paymentRepository.createPayment(data);
    }
    async updatePaymentStatus(id, status) {
        try {
            return await this.paymentRepository.updatePaymentStatus(id, status);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
