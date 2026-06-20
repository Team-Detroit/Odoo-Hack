"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfOrderController = void 0;
const selfOrder_service_1 = require("../service/selfOrder.service");
const response_util_1 = require("../../../shared/utils/response.util");
class SelfOrderController {
    selfOrderService = new selfOrder_service_1.SelfOrderService();
    async getMenuByToken(req, res) {
        try {
            const token = String(req.params.token);
            const menu = await this.selfOrderService.getMenuByToken(token);
            if (menu) {
                res.status(200).json((0, response_util_1.successResponse)('Menu fetched successfully', { menu }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Invalid token', 'Invalid token'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch menu', error.message));
        }
    }
    async createOrderByToken(req, res) {
        try {
            const token = String(req.params.token);
            const { items } = req.body;
            if (!items || items.length === 0) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'items array is required'));
            }
            const order = await this.selfOrderService.createOrderByToken(token, items);
            if (order) {
                res.status(201).json((0, response_util_1.successResponse)('Order created successfully', { order }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Invalid token', 'Invalid token'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create order', error.message));
        }
    }
    async getOrderStatusByToken(req, res) {
        try {
            const token = String(req.params.token);
            const order = await this.selfOrderService.getOrderStatusByToken(token);
            if (order) {
                res.status(200).json((0, response_util_1.successResponse)('Order status fetched successfully', { order }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('No order found', 'No order found for this token'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch order status', error.message));
        }
    }
}
exports.SelfOrderController = SelfOrderController;
