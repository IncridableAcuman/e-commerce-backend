export const Role = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const Category = {
  KIDS: 'KIDS',
  MEN: 'MEN',
  WOMEN: 'WOMEN',
} as const;
export type Category = (typeof Category)[keyof typeof Category];

export const Size = {
  X: 'X',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  M: 'M',
} as const;
export type Size = (typeof Size)[keyof typeof Size];

export const OrderStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  id: number;
  email: string;
  role: Role;
  accessToken: string;
}

export interface ProductResponse {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  category: Category;
  size: Size;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CartItemDto {
  id: number;
  product: ProductResponse;
  quantity: number;
  total: number;
}

export interface CartDto {
  id: number;
  items: CartItemDto[];
  totalAmount: number;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface OrderResponse {
  id: number;
  items: OrderItemResponse[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}