"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderItemController = void 0;
const orderItem_service_1 = require("../service/orderItem.service");
const response_util_1 = require("../../../shared/utils/response.util");
class OrderItemController {
    orderItemService = new orderItem_service_1.OrderItemService();
    async getOrderItemsByOrderId(req, res) {
        try {
            const orderId = String(req.params.orderId);
            const items = await this.orderItemService.getOrderItemsByOrderId(orderId);
            res.status(200).json((0, response_util_1.successResponse)('Order items fetched successfully', { items }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch order items', error.message));
        }
    }
    async getOrderItemById(req, res) {
        try {
            const id = String(req.params.id);
            const item = await this.orderItemService.getOrderItemById(id);
            if (item) {
                res.status(200).json((0, response_util_1.successResponse)('Order item fetched successfully', { item }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order item not found', 'Order item not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch order item', error.message));
        }
    }
    async createOrderItem(req, res) {
        try {
            const { orderId, productId, quantity, price } = req.body;
            if (!orderId || !productId || quantity == null || price == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'orderId, productId, quantity and price are required'));
            }
            const total = quantity * price;
            const item = await this.orderItemService.createOrderItem({ orderId, productId, quantity, price, total });
            res.status(201).json((0, response_util_1.successResponse)('Order item created successfully', { item }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create order item', error.message));
        }
    }
    async updateOrderItem(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const item = await this.orderItemService.updateOrderItem(id, data);
            if (item) {
                res.status(200).json((0, response_util_1.successResponse)('Order item updated successfully', { item }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order item not found', 'Order item not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update order item', error.message));
        }
    }
    async deleteOrderItem(req, res) {
        try {
            const id = String(req.params.id);
            const item = await this.orderItemService.deleteOrderItem(id);
            if (item) {
                res.status(200).json((0, response_util_1.successResponse)('Order item deleted successfully', {}));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Order item not found', 'Order item not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete order item', error.message));
        }
    }
}
exports.OrderItemController = OrderItemController;
