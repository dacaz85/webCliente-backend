// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/admin/Sidebar";
import api from "@/api/api";

export default function AdminDashboard({ usuario, rol }) {
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const res = await api.get("/user_permisos", {
                    params: { user_id: usuario?.id },
                });
                setPermisos(res.data || []);
            } catch (err) {
                console.error("Error cargando permisos:", err);
                setPermisos([]);
            } finally {
                setLoading(false);
            }
        };

        if (rol === "admin" && usuario?.id) fetchPermisos();
    }, [usuario, rol]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center">
                Cargando permisos...
            </div>
        );
    }

    return (
        <div className="flex flex-1 overflow-hidden">
            <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">
                <Sidebar permisos={permisos} />
            </aside>

            <main className="flex-1 flex flex-col p-6 bg-pageGradient overflow-hidden">
                <div className="flex-1 overflow-auto">
                    <Outlet context={{ usuario }} />
                </div>
            </main>
        </div>
    );
}
