// src/pages/clientes/Pedidos.jsx
import React, { useState, useEffect } from "react";
import api from "@/api/api";

export default function Pedidos({ activeSection }) {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (activeSection !== "Pedidos") return;

        const fetchPedidos = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await api.get("/pedidos", {
                    params: { user_id: localStorage.getItem("user_id") }
                });
                setPedidos(res.data || []);
            } catch (err) {
                console.error("Error cargando pedidos:", err);
                setError("No se pudieron cargar los pedidos");
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, [activeSection]);

    if (loading) return <div>Cargando pedidos...</div>;
    if (error) return <div>{error}</div>;
    if (pedidos.length === 0) return <div>No hay pedidos disponibles</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.map((p) => (
                <div key={p.id} className="border p-2 rounded hover:shadow-md">
                    Pedido #{p.id} - {p.estado || "Pendiente"}
                </div>
            ))}
        </div>
    );
}
