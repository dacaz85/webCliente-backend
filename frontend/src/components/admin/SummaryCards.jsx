//src/components/admin/SummaryCards.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function SummaryCards({ onFilter, refreshKey }) {
    const [stats, setStats] = useState({
        pendientes: 0,
        activos: 0,
        bloqueados: 0, // no usamos bloqueados
        total: 0,
    });

    const fetchStats = async () => {
        try {
            const res = await api.get("/users/all");
            const data = res.data || [];

            const pendientesCount = data.filter(u => !u.activo).length;
            const activosCount = data.filter(u => u.activo).length;

            setStats({
                pendientes: pendientesCount,
                activos: activosCount,
                bloqueados: 0,
                total: data.length,
            });
        } catch (err) {
            console.error("Error fetching user stats:", err);
            setStats({ pendientes: 0, activos: 0, bloqueados: 0, total: 0 });
        }
    };

    useEffect(() => {
        fetchStats();
    }, [refreshKey]);

    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <div
                className="bg-white p-4 rounded-2xl shadow text-center cursor-pointer hover:shadow-lg"
                onClick={() => onFilter("todos")}
            >
                <h3 className="text-sm text-gray-500">Todos</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div
                className="bg-white p-4 rounded-2xl shadow text-center cursor-pointer hover:shadow-lg"
                onClick={() => onFilter("pendiente")}
            >
                <h3 className="text-sm text-gray-500">Usuarios Pendientes</h3>
                <p className="text-2xl font-bold text-red-500">{stats.pendientes}</p>
            </div>
            <div
                className="bg-white p-4 rounded-2xl shadow text-center cursor-pointer hover:shadow-lg"
                onClick={() => onFilter("activo")}
            >
                <h3 className="text-sm text-gray-500">Usuarios Activos</h3>
                <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
            </div>            
        </div>
    );
}
