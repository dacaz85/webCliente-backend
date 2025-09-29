// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/admin/Sidebar";
import SummaryCards from "@/components/admin/SummaryCards";
import UserTable from "@/components/admin/UserTable";
import EmpresaTable from "@/components/admin/EmpresaTable";
import PermisosTable from "@/components/admin/PermisosTable";
import Footer from "@/components/layout/Footer";

export default function AdminDashboard({ usuario, rol, onLogout }) {
    const [activeSection, setActiveSection] = useState("Usuarios");
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

    // Cada vez que cambie activeSection
    useEffect(() => {
        if (activeSection === "Permisos") {
            // Resetear filtros cuando entramos a Permisos
            setSelectedUserId(null);
            setSelectedEmpresaId(null);
        }
    }, [activeSection]);

    const handleAction = (data) => {
        setRefreshKey(prev => prev + 1);
        setFilter(f => f);

        if (data?.section) setActiveSection(data.section);

        if (data?.userId) setSelectedUserId(data.userId);
        if (data?.empresaId) setSelectedEmpresaId(data.empresaId);
    };

    return (
        <div className="flex flex-col min-h-screen w-screen">
            <Header usuario={usuario} rol={rol} activeSection={activeSection} onLogout={onLogout} />
            <div className="flex flex-1 overflow-hidden">
                <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">
                    <Sidebar
                        usuario={usuario}
                        rol={rol}
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                    />
                </aside>
                <main className="flex-1 flex flex-col p-6 bg-pageGradient overflow-hidden">
                    {activeSection === "Usuarios" && (
                        <>
                            <SummaryCards onFilter={setFilter} refreshKey={refreshKey} />
                            <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                                <UserTable filter={filter} onAction={handleAction} />
                            </div>
                        </>
                    )}
                    {activeSection === "Empresas" && (
                        <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                            <EmpresaTable onAction={handleAction} />
                        </div>
                    )}
                    {activeSection === "Permisos" && (
                        <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                            <PermisosTable
                                initialUserId={selectedUserId}
                                initialEmpresaId={selectedEmpresaId}
                            />
                        </div>
                    )}
                </main>
            </div>
            <Footer />
        </div>
    );
}
