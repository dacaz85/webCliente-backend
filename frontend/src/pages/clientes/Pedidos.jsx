// src/pages/clientes/Pedidos.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function Pedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const res = await api.get("/pedidos");
                setPedidos(res.data || []);
            } catch (err) {
                console.error("Error cargando pedidos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []);

    if (loading)
        return <div className="flex justify-center items-center">Cargando pedidos...</div>;
    if (pedidos.length === 0)
        return <div className="text-center text-gray-500">No hay pedidos disponibles.</div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.map((pedido) => (
                <div key={pedido.id} className="border rounded p-4 bg-white shadow hover:shadow-md transition">
                    <div className="font-semibold">Pedido #{pedido.id}</div>
                    <div className="text-sm text-gray-600">{pedido.descripcion}</div>
                    <div className="text-xs text-gray-400">{new Date(pedido.fecha).toLocaleDateString()}</div>
                </div>
            ))}
        </div>
    );
}
