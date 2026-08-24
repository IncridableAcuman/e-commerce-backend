import React, { useEffect, useState } from 'react';
import type { ProductResponse } from '../types';
import { productApi, cartApi } from '../api/services';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productApi.getProducts(0, 12).then((res) => {
      setProducts(res.data.content);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = async (productId: number) => {
    try {
      await cartApi.addToCart(productId, 1);
      alert("Savatchaga qo'shildi!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mahsulotlar Katalogi</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img 
              src={`http://localhost:8080/uploads/${product.image}`} 
              alt={product.title} 
              className="w-full h-48 object-cover rounded mb-4" 
            />
            <h2 className="font-semibold text-lg">{product.title}</h2>
            <p className="text-gray-500 text-sm mb-2">{product.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xl font-bold text-blue-600">${product.price}</span>
              <button 
                onClick={() => handleAddToCart(product.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Savatchaga
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};