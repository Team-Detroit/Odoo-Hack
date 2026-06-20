import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';

export class ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async getAllProducts(search?: string, categoryId?: string) {
    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({ where });
  }

  async getProductById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async createProduct(data: CreateProductDto) {
    return this.prisma.product.create({
      data,
    });
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
