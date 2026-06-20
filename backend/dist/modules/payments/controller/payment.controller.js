"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("../service/payment.service");
const response_util_1 = require("../../../shared/utils/response.util");
const socket_1 = require("../../../shared/socket");
class PaymentController {
    paymentService = new payment_service_1.PaymentService();
    async getPaymentsByOrderId(req, res) {
        try {
            const orderId = String(req.params.orderId);
            const payments = await this.paymentService.getPaymentsByOrderId(orderId);
            res.status(200).json((0, response_util_1.successResponse)('Payments fetched successfully', { payments }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch payments', error.message));
        }
    }
    async getPaymentById(req, res) {
        try {
            const id = String(req.params.id);
            const payment = await this.paymentService.getPaymentById(id);
            if (payment) {
                res.status(200).json((0, response_util_1.successResponse)('Payment fetched successfully', { payment }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Payment not found', 'Payment not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch payment', error.message));
        }
    }
    async createPayment(req, res) {
        try {
            const { orderId, method, amount } = req.body;
            if (!orderId || !method || amount == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'orderId, method and amount are required'));
            }
            const payment = await this.paymentService.createPayment({ orderId, method, amount });
            res.status(201).json((0, response_util_1.successResponse)('Payment created successfully', { payment }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create payment', error.message));
        }
    }
    async updatePaymentStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'status is required'));
            }
            const payment = await this.paymentService.updatePaymentStatus(id, status);
            if (payment) {
                if (socket_1.io && status === 'PAID') {
                    socket_1.io.emit('payment:completed', { paymentId: id, orderId: payment.orderId });
                }
                res.status(200).json((0, response_util_1.successResponse)('Payment status updated successfully', { payment }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Payment not found', 'Payment not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update payment status', error.message));
        }
    }
}
exports.PaymentController = PaymentController;
