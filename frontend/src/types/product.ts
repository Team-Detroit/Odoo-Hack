import { Category } from './category';

export type UnitOfMeasure = 'piece' | 'kg' | 'litre';

export interface Product {
  id: string;
  name: string;
  category: Category;
  categoryId: string;
  price: number;
  unitOfMeasure: UnitOfMeasure;
  tax: number;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  showOnKds: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  categoryId: string;
  price: number;
  unitOfMeasure: UnitOfMeasure;
  tax: number;
  description?: string;
  image?: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: string;
}
