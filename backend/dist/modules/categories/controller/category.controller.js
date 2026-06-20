"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../service/category.service");
const response_util_1 = require("../../../shared/utils/response.util");
class CategoryController {
    categoryService = new category_service_1.CategoryService();
    async getAllCategories(req, res) {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json((0, response_util_1.successResponse)('Categories fetched successfully', categories));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch categories', error.message));
        }
    }
    async getCategoryById(req, res) {
        try {
            const id = String(req.params.id);
            const category = await this.categoryService.getCategoryById(id);
            if (category) {
                res.status(200).json((0, response_util_1.successResponse)('Category fetched successfully', category));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Category not found', 'Category not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to fetch category', error.message));
        }
    }
    async createCategory(req, res) {
        try {
            const { name, color } = req.body;
            if (!name) {
                return res.status(400).json((0, response_util_1.errorResponse)('Missing required fields', 'Name is required'));
            }
            const category = await this.categoryService.createCategory({ name, color });
            res.status(201).json((0, response_util_1.successResponse)('Category created successfully', category));
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to create category', error.message));
        }
    }
    async updateCategory(req, res) {
        try {
            const id = String(req.params.id);
            const data = req.body;
            const category = await this.categoryService.updateCategory(id, data);
            if (category) {
                res.status(200).json((0, response_util_1.successResponse)('Category updated successfully', category));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Category not found', 'Category not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to update category', error.message));
        }
    }
    async deleteCategory(req, res) {
        try {
            const id = String(req.params.id);
            const category = await this.categoryService.deleteCategory(id);
            if (category) {
                res.status(200).json((0, response_util_1.successResponse)('Category deleted successfully', category));
            }
            else {
                res.status(404).json((0, response_util_1.errorResponse)('Category not found', 'Category not found'));
            }
        }
        catch (error) {
            res.status(500).json((0, response_util_1.errorResponse)('Failed to delete category', error.message));
        }
    }
}
exports.CategoryController = CategoryController;
