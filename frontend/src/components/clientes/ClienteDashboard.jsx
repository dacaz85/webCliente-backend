// src/components/clientes/ClienteDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "@/api/api";

export default function ClienteDashboard({ usuario, rol, onLogout }) {
    const [activeSection, setActiveSection] = useState("");
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchPermisos = async () => {
            try {
                const res = await api.get("/user_permisos", {
                    params: { user_id: usuario.id },
                });

                const permisosData = res.data || [];
                setPermisos(permisosData);

                // Seleccionamos la primera subcarpeta con permiso "checked"
                const firstChecked = permisosData.find(p => p.checked);
                if (firstChecked) {
                    setActiveSection(firstChecked.name);
                    if (!location.pathname.includes(firstChecked.name.toLowerCase())) {
                        navigate(`/cliente/${firstChecked.name.toLowerCase()}`);
                    }
                }
            } catch (err) {
                console.error("Error cargando permisos:", err);
            } finally {
                setLoading(false);
            }
        };

        if (usuario.id) fetchPermisos();
    }, [usuario.id, location.pathname, navigate]);

    if (loading)
        return <div className="flex-1 flex justify-center items-center">Cargando permisos...</div>;

    return (
        <div className="flex flex-col min-h-screen w-screen">
            <Header
                usuario={usuario.username}
                rol={rol}
                activeSection={activeSection}
                onLogout={onLogout}
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    permisos={permisos}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />

                <main className="flex-1 flex flex-col p-6 bg-pageGradient overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
