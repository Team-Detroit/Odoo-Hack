import prisma from '../../../shared/prisma';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';

export class CategoryRepository {
  async getAllCategories() {
    return prisma.category.findMany();
  }

  async getCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  async createCategory(data: CreateCategoryDto) {
    return prisma.category.create({ data });
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
