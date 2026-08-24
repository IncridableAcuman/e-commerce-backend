import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput } from '../lib/validation/auth';
import { authApi } from '../api/services';

export const ForgotPasswordPage: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      setStatusMessage(null);
      await authApi.forgotPassword(data);
      setStatusMessage({
        type: 'success',
        text: 'Parolni tiklash havolasi emailingizga yuborildi!',
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Soʻrov yuborishda xatolik yuz berdi.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900">Parolni tiklash</h2>

        {statusMessage && (
          <div
            className={`p-3 rounded-lg text-sm border ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-600 border-red-200'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Yuborilmoqda...' : 'Havolani yuborish'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login sahifasiga qaytish
          </Link>
        </p>
      </div>
    </div>
  );
};