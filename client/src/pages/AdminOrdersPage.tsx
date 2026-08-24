import React, { useEffect, useState } from "react";
import type {OrderResponse} from "../types";
import {orderApi} from "../api/services.ts";
import {AdminOrdersTable} from "../components/AdminOrdersTable.tsx";

export const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderApi.getOrders();
            setOrders(response.data);
        } catch (error) {
            console.error("Buyurtmalarni yuklashda xatolik:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Buyurtmalar yuklanmoqda...</div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Buyurtmalar Boshqaruvi</h1>
            <AdminOrdersTable orders={orders} onStatusUpdate={fetchOrders} />
        </div>
    );
};