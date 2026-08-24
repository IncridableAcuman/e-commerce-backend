import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartApi, orderApi } from '../api/services';
import type { CartDto } from '../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    cartApi
        .getCart()
        .then((res) => {
          if (isMounted) {
            setCart(res.data);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => {
          if (isMounted) {
            setError(
                err.response?.data?.message || "Savatchani yuklashda xatolik yuz berdi"
            );
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const res = await cartApi.updateQuantity(itemId, newQuantity);
      setCart(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Miqdorni o'zgartirishda xatolik yuz berdi");
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Savatchani to'liq tozalamoqchimisiz?")) return;
    try {
      await cartApi.clearCart();
      setCart({ id: cart?.id || 0, items: [], totalAmount: 0 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Savatchani tozalashda xatolik yuz berdi");
    }
  };

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      await orderApi.checkout();
      alert("Buyurtmangiz muvaffaqiyatli qabul qilindi!");
      navigate('/orders');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Buyurtmani rasmiylashtirishda xatolik yuz berdi");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
        <div className="max-w-4xl mx-auto p-8 text-center my-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Savatchangiz bo'sh</h2>
          <p className="text-gray-500 mb-6">Xaridni davom ettirish uchun katalogga o'ting.</p>
          <Link
              to="/"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Katalogga qaytish
          </Link>
        </div>
    );
  }

  return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Xarid Savatchasi</h1>
          <button
              onClick={handleClearCart}
              className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
          >
            Savatchani tozalash
          </button>
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg">
              {error}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                >
                  <img
                      src={`http://localhost:8080/uploads/${item.product.image}`}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.product.title}</h3>
                    <p className="text-sm text-gray-500">
                      ${item.product.price.toFixed(2)} / dona
                    </p>
                    <p className="font-semibold text-blue-600 mt-1">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>

                  {/* Miqdorni boshqarish tugmalari (+ / -) */}
                  <div className="flex items-center gap-2 border rounded-lg p-1">
                    <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                    >
                      +
                    </button>
                  </div>

                  <button
                      onClick={() => handleUpdateQuantity(item.id, 0)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                  >
                    O'chirish
                  </button>
                </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-3">Buyurtma Xulosasi</h2>
            <div className="flex justify-between text-gray-600">
              <span>Mahsulotlar soni:</span>
              <span>{items.reduce((acc, i) => acc + i.quantity, 0)} ta</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Yetkazib berish:</span>
              <span className="text-green-600 font-medium">Bepul</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Jami summa:</span>
              <span className="text-blue-600">${cart?.totalAmount.toFixed(2)}</span>
            </div>
            <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 mt-4"
            >
              {isCheckingOut ? "Rasmiylashtirilmoqda..." : "Buyurtma berish"}
            </button>
          </div>
        </div>
      </div>
  );
};