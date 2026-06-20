import prisma from '../../../shared/prisma';
import { CreateCategoryDto } from '../dto/createCategory.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';

export class CategoryRepository {
  async getAllCategories() {
    const list = await prisma.category.findMany({
      include: {
        products: true
      }
    });
    return list.map(cat => {
      const hasProducts = cat.products && cat.products.length > 0;
      const isActiveVal = (cat as any).isActive !== false;
      return {
        ...cat,
        isActive: hasProducts ? isActiveVal : false
      };
    });
  }

  async getCategoryById(id: string) {
    const cat = await prisma.category.findUnique({ 
      where: { id },
      include: {
        products: true
      }
    });
    if (!cat) return null;
    const hasProducts = cat.products && cat.products.length > 0;
    const isActiveVal = (cat as any).isActive !== false;
    return {
      ...cat,
      isActive: hasProducts ? isActiveVal : false
    };
  }

  async createCategory(data: CreateCategoryDto) {
    return prisma.category.create({ data: data as any });
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return prisma.category.update({ where: { id }, data: data as any });
  }

  async deleteCategory(id: string) {
    return prisma.category.delete({ where: { id } });
  }
}
