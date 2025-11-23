import { api } from '@/src/core/api/apiClient';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { Product, Shop, StoreDetail } from '@/src/types/schema';
import { Platform } from 'react-native';

const appendFile = async (formData: FormData, key: string, uri: string) => {
  if (!uri) return;
  if (Platform.OS === 'web') {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = uri.split('/').pop() || `upload.jpg`;
        const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });
        formData.append(key, file);
    } catch (e) { console.error("Erro blob web:", e); }
  } else {
    const filename = uri.split('/').pop() || `file-${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image/jpeg`;
    formData.append(key, {
      uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      name: filename,
      type: type,
    } as any);
  }
};

const secureFetch = async (url: string, method: string, formData: FormData) => {
    const token = useAuthStore.getState().token;
    const baseURL = api.defaults.baseURL;

    console.log(`[FETCH] ${method} ${baseURL}${url}`);

    const response = await fetch(`${baseURL}${url}`, {
        method,
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
        },
    });

    const json = await response.json();
    if (!response.ok) {
        throw { 
            response: { data: json, status: response.status },
            message: json.message || "Erro na requisição"
        };
    }
    return json;
};

export const MarketService = {
  getShops: async () => (await api.get<Shop[]>('/stores')).data,
  
  getProductsByStore: async (storeId: string) => {
    const { data } = await api.get<Product[]>(`/products/store/${storeId}`);
    return data;
  },
  
  getStoreBySlug: async (slug: string) => {
    const { data } = await api.get<StoreDetail>(`/stores/${slug}`);
    return data;
  },

  getMyStores: async () => {
    try {
      const { data } = await api.get<Shop | Shop[]>('/stores/me');
      
      if (!data) return [];
      return Array.isArray(data) ? data : [data];
      
    } catch (error: any) {
      if (error.response?.status === 404) return [];
      throw error;
    }
  },

  deleteStore: async (storeId: string) => {
    console.log(`[DELETE] Excluindo loja ${storeId}`);
    return (await api.delete(`/stores/${storeId}`)).data;
  },

  getProducts: async () => (await api.get<Product[]>('/products/global')).data,
  
  getMyStore: async () => {
    try {
      const { data } = await api.get<Shop>('/stores/me'); 
      return data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      throw error;
    }
  },

  createStore: async (data: any, logoUri: string, avatarUri: string) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) formData.append(key, String(data[key]));
    });
    if (logoUri) await appendFile(formData, 'logo', logoUri);
    if (avatarUri) await appendFile(formData, 'avatar', avatarUri);

    return secureFetch('/stores', 'POST', formData);
  },

  updateStore: async (storeId: string, data: any, newLogoUri?: string, newAvatarUri?: string) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) formData.append(key, String(data[key]));
    });
    if (newLogoUri) await appendFile(formData, 'logo', newLogoUri);
    if (newAvatarUri) await appendFile(formData, 'avatar', newAvatarUri);

    return secureFetch(`/stores/${storeId}`, 'PATCH', formData);
  },

  createProduct: async (storeId: string, data: any, imageUri: string) => {
    const formData = new FormData();
    
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, String(data[key]));
        }
    });
    
    if (imageUri) await appendFile(formData, 'image', imageUri);

    const token = useAuthStore.getState().token;
    const baseURL = api.defaults.baseURL;

    console.log(`FRONT: Criando produto na loja ${storeId}...`);

    const response = await fetch(`${baseURL}/products/store/${storeId}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
        },
    });

    const json = await response.json();
    if (!response.ok) throw { message: json.message || "Erro ao criar produto" };
    return json;
  },

  updateProduct: async (productId: string, data: any, imageUri?: string) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) formData.append(key, String(data[key]));
    });
    if (imageUri) await appendFile(formData, 'image', imageUri);

    return secureFetch(`/products/${productId}`, 'PATCH', formData);
  },
  
  getProductById: async (id: string) => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  deleteProduct: async (productId: string) => {
    console.log(`[DELETE] Enviando requisição para /products/${productId}`);
    const { data } = await api.delete(`/products/${productId}`);
    return data;
  }
};