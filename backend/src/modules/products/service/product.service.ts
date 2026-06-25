import { PrismaClient, Prisma } from '@prisma/client';
import { ProductRepository } from '../repository/product.repository';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import "@prisma/client";
export class ProductService {
  private productRepository: ProductRepository;

  constructor(prisma: PrismaClient) {
    this.productRepository = new ProductRepository(prisma);
  }

  async getAllProducts(search?: string, categoryId?: string) {
    return this.productRepository.getAllProducts(search, categoryId);
  }

  async getProductById(id: string) {
    return this.productRepository.getProductById(id);
  }

  async createProduct(data: CreateProductDto) {
    return this.productRepository.createProduct(data);
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    try {
      return await this.productRepository.updateProduct(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.productRepository.deleteProduct(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
