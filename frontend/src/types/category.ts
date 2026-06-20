export interface Category {
  id: string;
  name: string;
  color: string; // hex color
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  color: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: string;
}
