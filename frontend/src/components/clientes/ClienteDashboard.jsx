// src/components/clientes/ClienteDashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/clientes/Sidebar";
import SubcarpetaViewer from "@/components/clientes/SubcarpetaViewer";
import { getPermisosCliente } from "@/api/api";

export default function ClienteDashboard({ usuario, rol, onLogout }) {
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
    const [subcarpetaSeleccionada, setSubcarpetaSeleccionada] = useState(null);

    const fetchPermisos = async (userId) => {
        try {
            setLoading(true);
            const data = await getPermisosCliente(userId);
            setPermisos(data);

            if (data.length > 0) {
                const primeraEmpresa = data[0];
                setEmpresaSeleccionada(primeraEmpresa);
                if (primeraEmpresa.subcarpetas.length > 0) {
                    setSubcarpetaSeleccionada(primeraEmpresa.subcarpetas[0]);
                }
            }
        } catch (err) {
            console.error("Error cargando permisos:", err);
            setError("No se pudieron cargar los permisos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (usuario?.id) fetchPermisos(usuario.id);
    }, [usuario]);

    if (!usuario) return <div>Cargando usuario...</div>;
    if (loading) return <div>Cargando permisos...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!permisos.length) return <div>No tienes permisos asignados</div>;

    return (
        <div className="flex flex-col min-h-screen">           
            <div className="flex flex-1 overflow-hidden">
                <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">
                    <Sidebar
                        empresas={permisos}
                        empresaSeleccionada={empresaSeleccionada}
                        setEmpresaSeleccionada={setEmpresaSeleccionada}
                        subcarpetaSeleccionada={subcarpetaSeleccionada}
                        setSubcarpetaSeleccionada={setSubcarpetaSeleccionada}
                    />
                </aside>

                <div className="flex-1 p-4 bg-pageGradient overflow-auto">
                    <SubcarpetaViewer
                        permisos={permisos}
                        empresaSeleccionada={empresaSeleccionada}
                        subcarpetaSeleccionada={subcarpetaSeleccionada}
                    />
                </div>
            </div>
        </div>
    );
}
