"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersRoutes = exports.OrderRepository = exports.OrderService = exports.OrderController = void 0;
var order_controller_1 = require("./controller/order.controller");
Object.defineProperty(exports, "OrderController", { enumerable: true, get: function () { return order_controller_1.OrderController; } });
var order_service_1 = require("./service/order.service");
Object.defineProperty(exports, "OrderService", { enumerable: true, get: function () { return order_service_1.OrderService; } });
var order_repository_1 = require("./repository/order.repository");
Object.defineProperty(exports, "OrderRepository", { enumerable: true, get: function () { return order_repository_1.OrderRepository; } });
var order_routes_1 = require("./routes/order.routes");
Object.defineProperty(exports, "ordersRoutes", { enumerable: true, get: function () { return __importDefault(order_routes_1).default; } });
