import { Prisma } from '@prisma/client';
import { CategoryRepository } from '../repository/category.repository';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryById(id: string) {
    return this.categoryRepository.getCategoryById(id);
  }

  async createCategory(data: CreateCategoryDto) {
    return this.categoryRepository.createCategory(data);
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    try {
      return await this.categoryRepository.updateCategory(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteCategory(id: string) {
    try {
      return await this.categoryRepository.deleteCategory(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
