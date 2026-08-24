import type {
  AuthResponse,
  CartDto,
  OrderResponse,
  PageResponse,
  ProductResponse,
  UserDto,
} from '../types';
import type {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from '../lib/validation/auth';
import { api } from './axiosInstance';

export const authApi = {
  login: (data: LoginInput) =>
      api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterInput) =>
      api.post<AuthResponse>('/auth/register', data),

  refresh: () =>
      api.get<AuthResponse>('/auth/refresh'),

  logout: () =>
      api.post<string>('/auth/logout'),

  forgotPassword: (data: ForgotPasswordInput) =>
      api.post<string>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordInput) =>
      api.put<string>('/auth/reset-password', data),

  getCurrentUser: () =>
      api.get<UserDto>('/users/me'),
};

export const productApi = {
  getProducts: (page = 0, size = 10) =>
      api.get<PageResponse<ProductResponse>>('/products', {
        params: { page, size },
      }),

  searchProducts: (params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    size?: number;
  }) =>
      api.get<PageResponse<ProductResponse>>('/products/search', { params }),

  getProduct: (id: number) =>
      api.get<ProductResponse>(`/products/${id}`),

  createProduct: (formData: FormData) =>
      api.post<ProductResponse>('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),

  deleteProduct: (id: number) =>
      api.delete<void>(`/products/${id}`),
};

export const cartApi = {
  getCart: () =>
      api.get<CartDto>('/cart'),

  addToCart: (productId: number, quantity = 1) =>
      api.post<CartDto>('/cart/add', null, {
        params: { productId, quantity },
      }),

  updateQuantity: (itemId: number, quantity: number) =>
      api.put<CartDto>(`/cart/items/${itemId}`, null, {
        params: { quantity },
      }),

  clearCart: () =>
      api.delete<void>('/cart'),
};

export const orderApi = {
  checkout: () =>
      api.post<OrderResponse>('/orders/checkout'),

  getOrders: () =>
      api.get<OrderResponse[]>('/orders'),
};