"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfOrderService = void 0;
const selfOrder_repository_1 = require("../repository/selfOrder.repository");
class SelfOrderService {
    selfOrderRepository = new selfOrder_repository_1.SelfOrderRepository();
    async getMenuByToken(token) {
        return this.selfOrderRepository.getMenuByToken(token);
    }
    async createOrderByToken(token, items) {
        return this.selfOrderRepository.createOrderByToken(token, items);
    }
    async getOrderStatusByToken(token) {
        return this.selfOrderRepository.getOrderStatusByToken(token);
    }
}
exports.SelfOrderService = SelfOrderService;
