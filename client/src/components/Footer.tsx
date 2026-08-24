import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Kompaniya Ma'lumoti */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white tracking-tight">E-STORE</h3>
            <p className="text-sm leading-relaxed">
              Sifatli va qulay onlayn xarid platformasi. Barcha kiyim va aksessuarlar bir joyda.
            </p>
          </div>

          {/* Tezkor Havolalar */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigatsiya
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Mahsulotlar Katalogi
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Xarid Savatchasi
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">
                  Buyurtmalar Tarixi
                </Link>
              </li>
            </ul>
          </div>

          {/* Kategoriyalar */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kategoriyalar
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-white cursor-pointer transition">Erkaklar kiyimlari</li>
              <li className="hover:text-white cursor-pointer transition">Ayollar kiyimlari</li>
              <li className="hover:text-white cursor-pointer transition">Bolalar kiyimlari</li>
            </ul>
          </div>

          {/* Bog'lanish */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Qo'llab-quvvatlash
            </h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@estore.uz</li>
              <li>Tel: +998 (90) 123-45-67</li>
              <li>Toshkent shahri, O'zbekiston</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} E-STORE Inc. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
};