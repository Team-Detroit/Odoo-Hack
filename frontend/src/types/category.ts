export interface Category {
  id: string;
  name: string;
  color: string; // hex color
  isActive: boolean;
  products?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
  isActive?: boolean;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}
