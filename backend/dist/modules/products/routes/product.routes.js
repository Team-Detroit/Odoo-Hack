"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const product_controller_1 = require("../controller/product.controller");
const router = (0, express_1.Router)();
const controller = new product_controller_1.ProductController(prisma_1.default);
router.get('/products', controller.getAllProducts.bind(controller));
router.get('/products/:id', controller.getProductById.bind(controller));
router.post('/products', controller.createProduct.bind(controller));
router.put('/products/:id', controller.updateProduct.bind(controller));
router.delete('/products/:id', controller.deleteProduct.bind(controller));
exports.default = router;
