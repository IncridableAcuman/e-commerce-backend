import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';
import { cartApi } from '../api/services';
import { Role } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = UseAuth();
  const [cartCount, setCartCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

useEffect(() => {
    // Foydalanuvchi tizimda bo'lmasa, so'rov yuborilmaydi va effect to'xtaydi
    if (!user) return;

    cartApi
      .getCart()
      .then((res) => {
        const totalItems = res.data.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      })
      .catch(() => setCartCount(0));
  }, [user]);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo va Asosiy Menyu */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight">
              E-STORE
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <Link to="/" className="hover:text-blue-600 transition">
                Katalog
              </Link>
              {user && (
                <Link to="/orders" className="hover:text-blue-600 transition">
                  Buyurtmalarim
                </Link>
              )}
              {user?.role === Role.ADMIN && (
                <Link to="/admin" className="text-purple-600 font-semibold hover:text-purple-700 transition">
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>

          {/* O'ng tomon: Savatcha va Profil / Auth tugmalari */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Savatcha Icon & Counter */}
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition"
                  title="Savatcha"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {/* Profil ma'lumoti */}
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                  <span className="text-sm font-medium text-gray-800">
                    {user.username}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition font-medium"
                  >
                    Chiqish
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Kirish
                </Link>
                <Link
                  to="/register"
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menyu tugmasi */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Link to="/cart" className="relative p-2 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isMobileMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menyu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-2 pb-4 space-y-3">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-gray-700 py-2 font-medium"
          >
            Katalog
          </Link>
          {user && (
            <>
              <Link
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 py-2 font-medium"
              >
                Buyurtmalarim
              </Link>
              {user.role === Role.ADMIN && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-purple-600 py-2 font-semibold"
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-2 border-t flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800">{user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs px-3 py-1.5 text-red-600 border border-red-200 rounded-lg"
                >
                  Chiqish
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="pt-2 border-t flex gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-gray-700 border rounded-lg font-medium"
              >
                Kirish
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};