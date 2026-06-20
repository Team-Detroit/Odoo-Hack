import { Request, Response } from 'express';
import { CategoryService } from '../service/category.service';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class CategoryController {
  private categoryService = new CategoryService();

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(successResponse('Categories fetched successfully', categories));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch categories', error.message));
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      if (category) {
        res.status(200).json(successResponse('Category fetched successfully', category));
      } else {
        res.status(404).json(errorResponse('Category not found', 'Category not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch category', error.message));
    }
  }

  async createCategory(req: Request, res: Response) {
    try {
      const { name, color, isActive } = req.body as CreateCategoryDto;
      if (!name) {
        return res.status(400).json(errorResponse('Missing required fields', 'Name is required'));
      }

      const category = await this.categoryService.createCategory({ name, color, isActive });
      res.status(201).json(successResponse('Category created successfully', category));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create category', error.message));
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body as UpdateCategoryDto;

      const category = await this.categoryService.updateCategory(id, data);
      if (category) {
        res.status(200).json(successResponse('Category updated successfully', category));
      } else {
        res.status(404).json(errorResponse('Category not found', 'Category not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update category', error.message));
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const category = await this.categoryService.deleteCategory(id);
      if (category) {
        res.status(200).json(successResponse('Category deleted successfully', category));
      } else {
        res.status(404).json(errorResponse('Category not found', 'Category not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete category', error.message));
    }
  }
}
