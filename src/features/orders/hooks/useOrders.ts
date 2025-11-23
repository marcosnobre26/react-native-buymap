import { useQuery } from '@tanstack/react-query';
import { OrderService } from '../services/orderService';

export function useClientOrders() {
  return useQuery({
    queryKey: ['clientOrders'],
    queryFn: OrderService.getClientOrders,
  });
}