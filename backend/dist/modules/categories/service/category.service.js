"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const client_1 = require("@prisma/client");
const category_repository_1 = require("../repository/category.repository");
class CategoryService {
    categoryRepository = new category_repository_1.CategoryRepository();
    async getAllCategories() {
        return this.categoryRepository.getAllCategories();
    }
    async getCategoryById(id) {
        return this.categoryRepository.getCategoryById(id);
    }
    async createCategory(data) {
        return this.categoryRepository.createCategory(data);
    }
    async updateCategory(id, data) {
        try {
            return await this.categoryRepository.updateCategory(id, data);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async deleteCategory(id) {
        try {
            return await this.categoryRepository.deleteCategory(id);
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
}
exports.CategoryService = CategoryService;
