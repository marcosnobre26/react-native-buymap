import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MarketService } from '../services/marketService';

export function useShops() {
  return useQuery({
    queryKey: ['shops'],
    queryFn: MarketService.getShops,
  });
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: MarketService.getProducts,
  });
}

export function useMyStoresList() {
  return useQuery({
    queryKey: ['my-stores-list'],
    queryFn: MarketService.getMyStores,
  });
}

export function useStoreDetails(storeId: string) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => MarketService.getStoreById(storeId),
    enabled: !!storeId,
  });
}

export function useStoreProducts(storeId?: string) {
  return useQuery({
    queryKey: ['products', storeId],
    queryFn: () => MarketService.getProductsByStore(storeId!),
    enabled: !!storeId,
  });
}

export function useStoreProfile(slug: string) {
  return useQuery({
    queryKey: ['store-profile', slug],
    queryFn: () => MarketService.getStoreBySlug(slug),
    enabled: !!slug,
  });
}

export function useMyStore() {
  return useQuery({
    queryKey: ['my-store'],
    queryFn: MarketService.getMyStore,
    retry: false,
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: ({ storeId, data, image }: { storeId: string, data: any, image: string }) => 
      MarketService.createProduct(storeId, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['store-profile'] });
    }
  });

  const update = useMutation({
    mutationFn: ({ id, data, image }: { id: string, data: any, image?: string }) => 
      MarketService.updateProduct(id, data, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['store-profile'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
    }
  });

  const remove = useMutation({
    mutationFn: MarketService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['store-profile'] });
    }
  });

  return { create, update, remove };
}

export function useStoreMutations() {
  const queryClient = useQueryClient();

  const createStore = useMutation({
    mutationFn: ({ data, logo, avatar }: { data: any, logo: string, avatar: string }) => 
      MarketService.createStore(data, logo, avatar),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-stores-list'] });
      queryClient.invalidateQueries({ queryKey: ['my-store'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    }
  });

  const updateStore = useMutation({
    mutationFn: ({ id, data, logo, avatar }: { id: string, data: any, logo?: string, avatar?: string }) => 
      MarketService.updateStore(id, data, logo, avatar),
    
    onSuccess: (updatedData) => {
      queryClient.setQueryData(['store', updatedData.id], updatedData);
      
      queryClient.invalidateQueries({ queryKey: ['my-stores-list'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      if (updatedData.slug) {
          queryClient.invalidateQueries({ queryKey: ['store-profile', updatedData.slug] });
      }
    }
  });

  const deleteStore = useMutation({
    mutationFn: MarketService.deleteStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-stores-list'] });
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['my-store'] });
    }
  });

  return { createStore, updateStore, deleteStore };
}

export function useProductDetails(id?: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => MarketService.getProductById(id!), 
    enabled: !!id,
  });
}