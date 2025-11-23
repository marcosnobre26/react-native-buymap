import { api } from '@/src/core/api/apiClient';
import { Order } from '@/src/types/schema';

export const OrderService = {
  getClientOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/orders/client/me');
    return data;
  },

  createOrder: async (orderData: any): Promise<Order> => {
    const { data } = await api.post<Order>('/orders', orderData);
    return data;
  },
};