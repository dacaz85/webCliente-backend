// src/components/clientes/ClienteDashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "./Sidebar";
import api from "@/api/api";

export default function ClienteDashboard({ usuario, rol, onLogout }) {
    const [activeSection, setActiveSection] = useState("");
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const res = await api.get("/user_permisos", {
                    params: { user_id: usuario.id },
                });
                setPermisos(res.data || []);
                if (res.data && res.data.length > 0) {
                    setActiveSection(res.data[0].subcarpeta);
                }
            } catch (err) {
                console.error("Error cargando permisos:", err);
            } finally {
                setLoading(false);
            }
        };

        if (usuario.id) fetchPermisos();
    }, [usuario.id]);

    if (loading) {
        return <div className="flex-1 flex justify-center items-center">Cargando permisos...</div>;
    }

    const permisoActivo = permisos.find(p => p.subcarpeta === activeSection);

    return (
        <div className="flex flex-col min-h-screen w-screen">
            <Header
                usuario={usuario.username}
                rol={rol}
                activeSection={activeSection}
                onLogout={onLogout}
            />

            <div className="flex flex-1 overflow-hidden">
                <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">
                    <Sidebar
                        permisos={permisos}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                </aside>

                <main className="flex-1 flex flex-col p-6 bg-pageGradient overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <Outlet context={{ activeSection, permisoActivo }} />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
