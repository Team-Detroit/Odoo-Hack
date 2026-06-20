"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class CategoryRepository {
    async getAllCategories() {
        const list = await prisma_1.default.category.findMany({
            include: {
                products: true
            }
        });
        return list.map(cat => {
            const hasProducts = cat.products && cat.products.length > 0;
            const isActiveVal = cat.isActive !== false;
            return {
                ...cat,
                isActive: hasProducts ? isActiveVal : false
            };
        });
    }
    async getCategoryById(id) {
        const cat = await prisma_1.default.category.findUnique({
            where: { id },
            include: {
                products: true
            }
        });
        if (!cat)
            return null;
        const hasProducts = cat.products && cat.products.length > 0;
        const isActiveVal = cat.isActive !== false;
        return {
            ...cat,
            isActive: hasProducts ? isActiveVal : false
        };
    }
    async createCategory(data) {
        return prisma_1.default.category.create({ data: data });
    }
    async updateCategory(id, data) {
        return prisma_1.default.category.update({ where: { id }, data: data });
    }
    async deleteCategory(id) {
        return prisma_1.default.category.delete({ where: { id } });
    }
}
exports.CategoryRepository = CategoryRepository;
