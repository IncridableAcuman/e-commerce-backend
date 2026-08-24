import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productApi } from '../api/services';
import { createProductSchema, type CreateProductInput } from '../lib/validation/product';
import { Category, type ProductResponse, Size } from '../types';

export const Admin: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createProductSchema),
  });

  const loadProducts = useCallback(async () => {
    try {
      const res = await productApi.getProducts(0, 50);
      setProducts(res.data.content);
    } catch {
      setError('Mahsulotlarni yuklashda xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onSubmit = async (data: CreateProductInput) => {
    try {
      setError(null);

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      formData.append('category', data.category);
      formData.append('size', data.sizes); // Backend DTO kutayotgan 'size' parametri
      formData.append('image', data.image[0]);

      await productApi.createProduct(formData);
      alert("Yangi mahsulot muvaffaqiyatli qo'shildi!");

      reset();
      setIsModalOpen(false);
      await loadProducts();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Mahsulotni saqlashda xatolik yuz berdi!");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchimisiz?")) return;
    try {
      await productApi.deleteProduct(id);
      await loadProducts();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Mahsulotni o'chirishda xatolik yuz berdi!");
    }
  };

  return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Boshqaruv Paneli</h1>
            <p className="text-gray-500 text-sm mt-1">Mahsulotlar katalogini boshqarish va yangilarini kiritish</p>
          </div>
          <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Yangi Mahsulot
          </button>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
              {error}
            </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
              <div className="p-8 text-center text-gray-500">Yuklanmoqda...</div>
          ) : products.length === 0 ? (
              <div className="p-8 text-center text-gray-500">Hozircha mahsulotlar yo'q.</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b">
                    <th className="p-4">Rasm</th>
                    <th className="p-4">Sarlavha</th>
                    <th className="p-4">Kategoriya</th>
                    <th className="p-4">O'lcham</th>
                    <th className="p-4">Narx</th>
                    <th className="p-4 text-right">Amallar</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                  {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <img
                              src={`http://localhost:8080/uploads/${product.image}`}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                          />
                        </td>
                        <td className="p-4 font-medium text-gray-900">{product.title}</td>
                        <td className="p-4">
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                        {product.category}
                      </span>
                        </td>
                        <td className="p-4">
                      <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                        {product.size}
                      </span>
                        </td>
                        <td className="p-4 font-bold text-gray-900">${product.price.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <button
                              onClick={() => handleDelete(product.id)}
                              className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                          >
                            O'chirish
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>

        {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="text-xl font-bold text-gray-900">Yangi Mahsulot Qo'shish</h2>
                  <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mahsulot Nomi
                    </label>
                    <input
                        type="text"
                        {...register('title')}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Masalan: Qora Charm Kurtka"
                    />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tavsif
                    </label>
                    <textarea
                        rows={3}
                        {...register('description')}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Mahsulot haqida batafsil ma'lumot..."
                    />
                    {errors.description && (
                        <p className="text-xs text-red-500 mt-1">{errors.description.message as string}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Narx ($)
                      </label>
                      <input
                          type="number"
                          step="0.01"
                          {...register('price')}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="49.99"
                      />
                      {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message as string}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kategoriya
                      </label>
                      <select
                          {...register('category')}
                          className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="">Tanlang</option>
                        {Object.values(Category).map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                        ))}
                      </select>
                      {errors.category && (
                          <p className="text-xs text-red-500 mt-1">{errors.category.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      O'lcham
                    </label>
                    <select
                        {...register('sizes')}
                        className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="">Tanlang</option>
                      {Object.values(Size).map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                      ))}
                    </select>
                    {errors.sizes && <p className="text-xs text-red-500 mt-1">{errors.sizes.message as string}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mahsulot Rasmi
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {errors.image && (
                        <p className="text-xs text-red-500 mt-1">{errors.image.message as string}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-medium"
                    >
                      Bekor qilish
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                    >
                      {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};