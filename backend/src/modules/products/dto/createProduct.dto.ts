export interface CreateProductDto {
  name: string;
  price: number;
  categoryId: string;
  description?: string;
  image?: string;
  tax?: number;
  available: boolean;
  isKitchenItem: boolean;
  unitOfMeasure?: string;
}
