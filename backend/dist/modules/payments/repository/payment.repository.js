"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class PaymentRepository {
    async getPaymentsByOrderId(orderId) {
        return prisma_1.default.payment.findMany({ where: { orderId } });
    }
    async getPaymentById(id) {
        return prisma_1.default.payment.findUnique({ where: { id } });
    }
    async createPayment(data) {
        return prisma_1.default.payment.create({ data });
    }
    async updatePaymentStatus(id, status) {
        return prisma_1.default.payment.update({ where: { id }, data: { status } });
    }
}
exports.PaymentRepository = PaymentRepository;
