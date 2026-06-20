"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../service/order.service");
const response_util_1 = require("../../../shared/utils/response.util");
const socket_1 = require("../../../shared/socket");
class OrderController {
    orderService = new order_service_1.OrderService();
    async getAllOrders(req, res) {
        try {
            const orders = await this.orderService.getAllOrders();
            res.status(200).json((0, response_util_1.successResponse)('Orders fetched successfully', orders));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch orders', error.message));
        }
    }
    async getOrderById(req, res) {
        try {
            const id = String(req.params.id);
            const order = await this.orderService.getOrderById(id);
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order fetched successfully', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch order', error.message));
        }
    }
    async createOrder(req, res) {
        try {
            const { sessionId, tableId, customerId, subtotal, discount, tax, total, items, selfOrder, paymentTag } = req.body;
            if (!sessionId || !tableId || subtotal == null || total == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'sessionId, tableId, subtotal and total are required'));
            }
            const order = await this.orderService.createOrder({
                sessionId,
                tableId,
                customerId: (customerId && customerId.trim() !== '') ? customerId : undefined,
                subtotal: Number(subtotal),
                discount: discount ?? 0,
                tax: tax ?? 0,
                total: Number(total),
                selfOrder: !!selfOrder,
                paymentTag: paymentTag ?? null,
                items: items ?? []
            });
            if (socket_1.io) {
                socket_1.io.emit('order:created', { orderId: order.id, tableId });
            }
            res.status(201).json((0, response_util_1.successResponse)('Order created successfully', order));
        }
        catch (error) {
            console.error("Order creation failed in controller:", error);
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create order', error.message));
        }
    }
    async updateOrder(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const order = await this.orderService.updateOrder(id, data);
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order updated successfully', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update order', error.message));
        }
    }
    async deleteOrder(req, res) {
        try {
            const id = String(req.params.id);
            const order = await this.orderService.deleteOrder(id);
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order deleted successfully', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete order', error.message));
        }
    }
    async sendToKitchen(req, res) {
        try {
            const id = String(req.params.id);
            const order = await this.orderService.sendToKitchen(id);
            if (order) {
                if (socket_1.io) {
                    socket_1.io.emit('order:sent-to-kitchen', { orderId: id });
                }
                res.status(200).json((0, response_util_1.successResponse)('Order sent to kitchen', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to send order to kitchen', error.message));
        }
    }
    async updateOrderStatus(req, res) {
        try {
            const id = String(req.params.id);
            const { status } = req.body;
            if (!status) {
                return res.status(400).json((0, response_util_1.errorResponse)('Status is required', 'status is required'));
            }
            const order = await this.orderService.updateOrder(id, { status: status.toUpperCase() });
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order status updated successfully', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update order status', error.message));
        }
    }
    async cancelOrder(req, res) {
        try {
            const id = String(req.params.id);
            const order = await this.orderService.cancelOrder(id);
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order cancelled successfully', order));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order not found', 'Order not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to cancel order', error.message));
        }
    }
}
exports.OrderController = OrderController;
