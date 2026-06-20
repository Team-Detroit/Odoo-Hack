import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { OrderStatus } from '../types/order';

export const useOrders = (sessionId?: string) => {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ['orders', sessionId], queryFn: orderService.mockGetBySession });
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => orderService.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
  const remove = useMutation({ mutationFn: (id: string) => orderService.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }) });
  return { ...query, updateStatus, remove };
};
