// src/pages/clientes/Pedidos.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useOutletContext } from "react-router-dom";

export default function Pedidos() {
    const { usuario } = useOutletContext();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const res = await api.get("/pedidos", { params: { user_id: usuario.id } });
                setPedidos(res.data || []);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los pedidos");
            } finally {
                setLoading(false);
            }
        };
        fetchPedidos();
    }, [usuario.id]);

    if (loading) return <div>Cargando pedidos...</div>;
    if (error) return <div>{error}</div>;
    if (!pedidos.length) return <div>No hay pedidos disponibles</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pedidos.map(p => (
                <div key={p.id} className="border p-2 rounded hover:shadow-md">
                    Pedido #{p.id} - {p.estado || "Pendiente"}
                </div>
            ))}
        </div>
    );
}
