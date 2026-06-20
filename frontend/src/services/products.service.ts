import { apiClient } from "./apiClient";

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  tax: number;
  isKitchenItem: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export const productsService = {
  async getProducts() {
    const response = await apiClient.get<{ products: Product[] }>("/products");
    return response.data.products;
  },

  async getProductById(id: string) {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(data: Omit<Product, "id">) {
    const response = await apiClient.post<Product>("/products", data);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    await apiClient.delete(`/products/${id}`);
  },
};

export const categoriesService = {
  async getCategories() {
    const response = await apiClient.get<{ categories: Category[] }>("/categories");
    return response.data.categories;
  },

  async getCategoryById(id: string) {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async createCategory(data: Omit<Category, "id">) {
    const response = await apiClient.post<Category>("/categories", data);
    return response.data;
  },

  async updateCategory(id: string, data: Partial<Category>) {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async deleteCategory(id: string) {
    await apiClient.delete(`/categories/${id}`);
  },
};
