import React, { useEffect, useState } from 'react';
import { orderApi } from '../api/services';
import { type OrderResponse, OrderStatus } from '../types';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getOrders();
        setOrders(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.response?.data?.message || "Buyurtmalarni yuklashda xatolik yuz berdi");
      } {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: OrderStatus) => {
    const styles: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [OrderStatus.PROCESSING]: 'bg-blue-100 text-blue-800 border-blue-200',
      [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800 border-purple-200',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800 border-green-200',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Buyurtmalarim Tarixi</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">Sizda hali hech qanday buyurtma yo'q.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Buyurtma sarlavhasi */}
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-gray-500">Buyurtma ID</span>
                  <p className="font-bold text-gray-900">#{order.id}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Sana</span>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Status</span>
                  {getStatusBadge(order.status)}
                </div>
                <div>
                  <span className="text-xs text-gray-500">Jami Summa</span>
                  <p className="font-bold text-blue-600">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Buyurtma ichidagi mahsulotlar */}
              <div className="p-4 divide-y">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://localhost:8080/uploads/${item.productImage}`}
                        alt={item.productTitle}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-50"
                      />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.productTitle}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} x {item.quantity} ta
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};