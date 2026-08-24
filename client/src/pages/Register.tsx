import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterInput } from '../lib/validation/auth';
import { authApi } from '../api/services';
import { UseAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = UseAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      const res = await authApi.register(data);
      localStorage.setItem('accessToken', res.data.accessToken);

      const userRes = await authApi.getCurrentUser();
      setUser(userRes.data);

      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Ro'yxatdan o'tish</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Foydalanuvchi nomi</label>
            <input
              type="text"
              {...register('username')}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="izzatbek"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="example@domain.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parol</label>
            <input
              type="password"
              {...register('password')}
              className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Hisobingiz bormi?{' '}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Tizimga kirish
          </Link>
        </p>
      </div>
    </div>
  );
};