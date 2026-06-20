import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import { CreateCategoryRequest } from '../types/category';

export const useCategories = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  const create = useMutation({ mutationFn: (d: CreateCategoryRequest) => categoryService.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
  const remove = useMutation({ mutationFn: (id: string) => categoryService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }) });
  return { ...query, create, remove };
};
