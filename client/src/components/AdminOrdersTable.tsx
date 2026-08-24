import { OrderStatus, type OrderResponse } from "../types";
import { orderApi } from "../api/services.ts";

interface Props {
    orders: OrderResponse[];
    onStatusUpdate: () => void;
}

export const AdminOrdersTable = ({ orders, onStatusUpdate }: Props) => {

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        try {
            await orderApi.updateOrderStatus(orderId, newStatus);
            onStatusUpdate();
        } catch (error) {
            console.error("Statusni o'zgartirishda xatolik:", error);
            alert("Statusni o'zgartirishda xatolik yuz berdi.");
        }
    };

    // Status turiga qarab nishon (badge) ranglarini berish
    const getStatusBadge = (status: OrderStatus) => {
        const badgeStyles: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: "bg-amber-100 text-amber-800 border-amber-200",
            [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800 border-blue-200",
            [OrderStatus.SHIPPED]: "bg-purple-100 text-purple-800 border-purple-200",
            [OrderStatus.DELIVERED]: "bg-emerald-100 text-emerald-800 border-emerald-200",
            [OrderStatus.CANCELLED]: "bg-rose-100 text-rose-800 border-rose-200",
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
        );
    };

    if (!orders || orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                Hozircha hech qanday buyurtma mavjud emas.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 font-semibold">Buyurtma ID</th>
                        <th className="px-6 py-4 font-semibold">Jami summa</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Amallar</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                #{order.id}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                ${order.totalAmount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none transition-all cursor-pointer shadow-sm hover:border-gray-400"
                                >
                                    {Object.values(OrderStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};