export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  permissions: ProductPermission[];
}

export interface Product {
  _id: string;
  image: string;
  name?: string;
  productCode: string;
  size: string;
  manufacturer: string;
  stock: number;
  badStock: number;
  bookings: number;
  availableStock: number;
}

export interface ProductPermission {
  field: ProductField;
  actions: ProductAction[];
}

export type ProductField = 
  | 'image'
  | 'name'
  | 'productCode'
  | 'size'
  | 'manufacturer'
  | 'stock'
  | 'badStock'
  | 'bookings'
  | 'availableStock';

export type ProductAction = 'view' | 'edit' | 'delete';

export interface AuthResponse {
  token: string;
  user: User;
}

export const PRODUCT_FIELDS: ProductField[] = [
  'image',
  'name',
  'productCode',
  'size',
  'manufacturer',
  'stock',
  'badStock',
  'bookings',
  'availableStock'
];

export const PRODUCT_ACTIONS: ProductAction[] = ['view', 'edit', 'delete'];