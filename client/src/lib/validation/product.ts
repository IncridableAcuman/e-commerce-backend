import { z } from 'zod';
import { Category, Size } from '../../types';

export const createProductSchema = z.object({
  title: z
    .string()
    .min(3, "Sarlavha kamida 3 ta belgidan iborat bo'lishi kerak!")
    .max(100, 'Sarlavha 100 ta belgidan oshmasligi kerak!'),
  description: z
    .string()
    .min(5, "Tavsif kamida 5 ta belgidan iborat bo'lishi kerak!"),
  price: z.coerce
    .number({ message: 'Toʻgʻri narx kiriting!' })
    .positive("Narx 0 dan katta bo'lishi kerak!"),
  category: z.nativeEnum(Category, {
    message: 'Kategoriyani tanlang!',
  }),
  sizes: z.nativeEnum(Size, {
    message: "O'lchamni tanlang!",
  }),
  image: z
    .any()
    .refine((files) => files && files.length > 0, 'Mahsulot rasmini yuklash shart!')
    .refine(
      (files) => files?.[0]?.size <= 5 * 1024 * 1024,
      'Rasm hajmi 5MB dan oshmasligi kerak!'
    ),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;