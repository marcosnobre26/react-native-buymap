import { api } from '@/src/core/api/apiClient';

export interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export const ShoppingListService = {
  get: async (): Promise<ListItem[]> => {
    const { data } = await api.get('/shopping-list');
    return data.items || [];
  },

  save: async (items: ListItem[]) => {
    await api.put('/shopping-list', { items });
  }
};