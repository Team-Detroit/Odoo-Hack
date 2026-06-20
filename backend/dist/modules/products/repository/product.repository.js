"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllProducts(search, categoryId) {
        const where = {};
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: { category: true }
        });
    }
    async getProductById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: { category: true }
        });
    }
    async createProduct(data) {
        return this.prisma.product.create({
            data,
        });
    }
    async updateProduct(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async deleteProduct(id) {
        return this.prisma.product.delete({
            where: { id },
        });
    }
}
exports.ProductRepository = ProductRepository;
