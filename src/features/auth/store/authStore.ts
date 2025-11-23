import { User } from '@/src/types/schema';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  login: async (user, token) => {
    try {
      const userStr = JSON.stringify(user);
      if (Platform.OS === 'web') {
        localStorage.setItem('auth-token', token);
        localStorage.setItem('auth-user', userStr);
      } else {
        await SecureStore.setItemAsync('auth-token', token);
        await SecureStore.setItemAsync('auth-user', userStr);
      }
    } catch (e) { console.error("Erro ao salvar:", e); }
    
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');
      } else {
        await SecureStore.deleteItemAsync('auth-token');
        await SecureStore.deleteItemAsync('auth-user');
      }
    } catch (e) { console.error("Erro ao limpar:", e); }
    
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadSession: async () => {
    console.log("AUTH: Carregando sessão manualmente...");
    try {
      let token, userStr;

      if (Platform.OS === 'web') {
        token = localStorage.getItem('auth-token');
        userStr = localStorage.getItem('auth-user');
      } else {
        token = await SecureStore.getItemAsync('auth-token').catch(() => null);
        userStr = await SecureStore.getItemAsync('auth-user').catch(() => null);
      }

      if (token && userStr) {
        console.log("AUTH: Sessão encontrada!");
        set({ token, user: JSON.parse(userStr), isAuthenticated: true });
      } else {
        console.log("AUTH: Nenhuma sessão.");
      }
    } catch (e) {
      console.error("AUTH: Erro ao ler sessão", e);
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      console.log("AUTH: App liberado.");
      set({ isHydrated: true });
    }
  },
}));