"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = exports.ProductRepository = exports.ProductService = exports.ProductController = void 0;
var product_controller_1 = require("./controller/product.controller");
Object.defineProperty(exports, "ProductController", { enumerable: true, get: function () { return product_controller_1.ProductController; } });
var product_service_1 = require("./service/product.service");
Object.defineProperty(exports, "ProductService", { enumerable: true, get: function () { return product_service_1.ProductService; } });
var product_repository_1 = require("./repository/product.repository");
Object.defineProperty(exports, "ProductRepository", { enumerable: true, get: function () { return product_repository_1.ProductRepository; } });
var product_routes_1 = require("./routes/product.routes");
Object.defineProperty(exports, "productsRoutes", { enumerable: true, get: function () { return __importDefault(product_routes_1).default; } });
