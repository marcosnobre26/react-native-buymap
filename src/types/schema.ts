export type UserRole = 'CLIENT' | 'SHOPPER';

export type OrderStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'SHOPPING' 
  | 'DELIVERING' 
  | 'COMPLETED' 
  | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  document?: string;
  avatarUrl?: string;
  address?: {
    street: string;
    number: string;
    zipCode: string;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number | string; 
  description?: string;
  imageUrl?: string;
  brand?: string;
  barcode?: string;
  storeId?: string;
  isAvailable?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  avatarUrl?: string;
  latitude?: number;
  longitude?: number;
  commissionRate?: number;
}

export interface StoreDetail extends Shop {
  products: Product[]; 
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  clientId: string;
  storeId: string;
  storeName: string;
  shopperId?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  deliveryFee: number;
  createdAt: string;
  deliveryLocation?: {
    latitude: number;
    longitude: number;
    addressLine: string;
  };
}