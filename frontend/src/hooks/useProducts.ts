import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { CreateProductRequest } from '../types/product';

export const useProducts = () => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const create = useMutation({ mutationFn: (d: CreateProductRequest) => productService.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
  const remove = useMutation({ mutationFn: (id: string) => productService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }) });
  return { ...query, create, remove };
};
