import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/createProduct.dto';
import { UpdateProductDto } from '../dto/updateProduct.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class ProductController {
  private productService: ProductService;

  constructor(prisma: PrismaClient) {
    this.productService = new ProductService(prisma);
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const categoryId = typeof req.query.categoryId === 'string' ? req.query.categoryId : undefined;
      const products = await this.productService.getAllProducts(search, categoryId);
      res.status(200).json(successResponse('Products fetched successfully', { products }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch products', error.message));
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const product = await this.productService.getProductById(id);
      if (product) {
        res.status(200).json(successResponse('Product fetched successfully', { product }));
      } else {
        res.status(404).json(errorResponse('Product not found', 'Product not found')); 
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch product', error.message));
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      const {
        name,
        price,
        categoryId,
        description,
        image,
        tax,
        available,
        isKitchenItem,
      } = req.body as CreateProductDto;

      if (!name || price == null || !categoryId) {
        return res.status(400).json(errorResponse('Missing required fields', 'Name, price, and categoryId are required'));
      }

      if (typeof price !== 'number') {
        return res.status(400).json(errorResponse('Invalid product payload', 'price must be a number'));
      }

      const createProductDto: CreateProductDto = {
        name,
        price,
        categoryId,
        description,
        image,
        tax: tax ?? 0,
        available: available !== undefined ? available : true,
        isKitchenItem: isKitchenItem !== undefined ? isKitchenItem : true,
      };

      const newProduct = await this.productService.createProduct(createProductDto);
      res.status(201).json(successResponse('Product created successfully', { product: newProduct }));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to create product', error.message));
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const updateProductDto: UpdateProductDto = req.body;

      if ('price' in updateProductDto && typeof updateProductDto.price !== 'number') {
        return res.status(400).json(errorResponse('Invalid product payload', 'price must be a number'));
      }

      if ('available' in updateProductDto && typeof updateProductDto.available !== 'boolean') {
        return res.status(400).json(errorResponse('Invalid product payload', 'available must be a boolean'));
      }

      if ('isKitchenItem' in updateProductDto && typeof updateProductDto.isKitchenItem !== 'boolean') {
        return res.status(400).json(errorResponse('Invalid product payload', 'isKitchenItem must be a boolean'));
      }

      const updatedProduct = await this.productService.updateProduct(id, updateProductDto);
      if (updatedProduct) {
        res.status(200).json(successResponse('Product updated successfully', { product: updatedProduct }));
      } else {
        res.status(404).json(errorResponse('Product not found', 'Product not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to update product', error.message));
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const deletedProduct = await this.productService.deleteProduct(id);
      if (deletedProduct) {
        res.status(200).json(successResponse('Product deleted successfully', {}));
      } else {
        res.status(404).json(errorResponse('Product not found', 'Product not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to delete product', error.message));
    }
  }
}
