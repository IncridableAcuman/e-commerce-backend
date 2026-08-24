import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritilishi shart!')
    .email('Yaroqsiz email formati!'),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak!")
    .max(255, 'Parol 255 ta belgidan oshmasligi kerak!'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak!")
    .max(50, 'Foydalanuvchi nomi 50 ta belgidan oshmasligi kerak!'),
  email: z
    .string()
    .min(1, 'Email kiritilishi shart!')
    .email('Yaroqsiz email formati!'),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak!")
    .max(255, 'Parol 255 ta belgidan oshmasligi kerak!'),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email kiritilishi shart!')
    .email('Yaroqsiz email formati!'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token kiritilishi shart!'),
  password: z
    .string()
    .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak!")
    .max(255, 'Parol 255 ta belgidan oshmasligi kerak!'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;