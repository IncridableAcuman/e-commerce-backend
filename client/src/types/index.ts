export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Category {
  KIDS = 'KIDS',
  MEN = 'MEN',
  WOMEN = 'WOMEN'
}

export enum Size {
  X = 'X',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
  M = 'M'
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

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
  sizes: Size;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CartItemDto {
  quantity: number;
  total: number;
  title: string;
  price: number;
  image: string;
}

export interface CartDto {
  id: number;
  items: CartItemDto[];
  userId: number;
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