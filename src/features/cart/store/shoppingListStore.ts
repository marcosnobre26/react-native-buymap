import { create } from 'zustand';
import { ListItem, ShoppingListService } from '../services/shoppingListService';

interface ShoppingListState {
  items: ListItem[];
  isLoading: boolean;
  
  fetchList: () => Promise<void>;
  addItem: (text: string) => void;
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearList: () => void;
}

export const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchList: async () => {
    set({ isLoading: true });
    try {
      const items = await ShoppingListService.get();
      set({ items });
    } catch (e) { console.error(e); }
    set({ isLoading: false });
  },

  addItem: (text) => {
    const newItem = { id: Date.now().toString(), text, completed: false };
    const newItems = [...get().items, newItem];
    
    set({ items: newItems });
    ShoppingListService.save(newItems);
  },

  toggleItem: (id) => {
    const newItems = get().items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    set({ items: newItems });
    ShoppingListService.save(newItems);
  },

  removeItem: (id) => {
    const newItems = get().items.filter(item => item.id !== id);
    set({ items: newItems });
    ShoppingListService.save(newItems);
  },

  clearList: () => {
    set({ items: [] });
    ShoppingListService.save([]);
  }
}));