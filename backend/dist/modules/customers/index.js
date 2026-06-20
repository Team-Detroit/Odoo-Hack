"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customersRoutes = exports.CustomerRepository = exports.CustomerService = exports.CustomerController = void 0;
var customer_controller_1 = require("./controller/customer.controller");
Object.defineProperty(exports, "CustomerController", { enumerable: true, get: function () { return customer_controller_1.CustomerController; } });
var customer_service_1 = require("./service/customer.service");
Object.defineProperty(exports, "CustomerService", { enumerable: true, get: function () { return customer_service_1.CustomerService; } });
var customer_repository_1 = require("./repository/customer.repository");
Object.defineProperty(exports, "CustomerRepository", { enumerable: true, get: function () { return customer_repository_1.CustomerRepository; } });
var customer_routes_1 = require("./routes/customer.routes");
Object.defineProperty(exports, "customersRoutes", { enumerable: true, get: function () { return __importDefault(customer_routes_1).default; } });
