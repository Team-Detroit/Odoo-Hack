"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const product_repository_1 = require("../repository/product.repository");
class ProductService {
    productRepository;
    constructor(prisma) {
        this.productRepository = new product_repository_1.ProductRepository(prisma);
    }
    async getAllProducts(search, categoryId) {
        return this.productRepository.getAllProducts(search, categoryId);
    }
    async getProductById(id) {
        return this.productRepository.getProductById(id);
    }
    async createProduct(data) {
        return this.productRepository.createProduct(data);
    }
    async updateProduct(id, data) {
        try {
            return await this.productRepository.updateProduct(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteProduct(id) {
        try {
            return await this.productRepository.deleteProduct(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.ProductService = ProductService;
