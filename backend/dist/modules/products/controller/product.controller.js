"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../service/product.service");
const response_util_1 = require("../../../shared/utils/response.util");
class ProductController {
    productService;
    constructor(prisma) {
        this.productService = new product_service_1.ProductService(prisma);
    }
    async getAllProducts(req, res) {
        try {
            const search = typeof req.query.search === 'string' ? req.query.search : undefined;
            const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
            const products = await this.productService.getAllProducts(search, categoryId);
            res.status(200).json((0, response_util_1.successResponse)('Products fetched successfully', { products }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch products', error.message));
        }
    }
    async getProductById(req, res) {
        try {
            const id = String(req.params.id);
            const product = await this.productService.getProductById(id);
            if (product) {
                res.status(200).json((0, response_util_1.successResponse)('Product fetched successfully', { product }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Product not found', 'Product not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch product', error.message));
        }
    }
    async createProduct(req, res) {
        try {
            const { name, price, categoryId, description, image, tax, available, isKitchenItem, } = req.body;
            if (!name || price == null || !categoryId || available == null || isKitchenItem == null) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'Name, price, categoryId, available, and isKitchenItem are required'));
            }
            if (typeof price !== 'number' || typeof available !== 'boolean' || typeof isKitchenItem !== 'boolean') {
                return res.status(400).json((0, response_util_1.errorResponse)('Invalid product payload', 'price must be a number, available and isKitchenItem must be boolean'));
            }
            const createProductDto = {
                name,
                price,
                categoryId,
                description,
                image,
                tax,
                available,
                isKitchenItem,
            };
            const newProduct = await this.productService.createProduct(createProductDto);
            res.status(201).json((0, response_util_1.successResponse)('Product created successfully', { product: newProduct }));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create product', error.message));
        }
    }
    async updateProduct(req, res) {
        try {
            const id = String(req.params.id);
            const updateProductDto = req.body;
            if ('price' in updateProductDto && typeof updateProductDto.price !== 'number') {
                return res.status(400).json((0, response_util_1.errorResponse)('Invalid product payload', 'price must be a number'));
            }
            if ('available' in updateProductDto && typeof updateProductDto.available !== 'boolean') {
                return res.status(400).json((0, response_util_1.errorResponse)('Invalid product payload', 'available must be a boolean'));
            }
            if ('isKitchenItem' in updateProductDto && typeof updateProductDto.isKitchenItem !== 'boolean') {
                return res.status(400).json((0, response_util_1.errorResponse)('Invalid product payload', 'isKitchenItem must be a boolean'));
            }
            const updatedProduct = await this.productService.updateProduct(id, updateProductDto);
            if (updatedProduct) {
                res.status(200).json((0, response_util_1.successResponse)('Product updated successfully', { product: updatedProduct }));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Product not found', 'Product not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update product', error.message));
        }
    }
    async deleteProduct(req, res) {
        try {
            const id = String(req.params.id);
            const deletedProduct = await this.productService.deleteProduct(id);
            if (deletedProduct) {
                res.status(200).json((0, response_util_1.successResponse)('Product deleted successfully', {}));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Product not found', 'Product not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete product', error.message));
        }
    }
}
exports.ProductController = ProductController;
