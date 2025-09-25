// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import SummaryCards from "@/components/admin/SummaryCards";
import UserTable from "@/components/admin/UserTable";

export default function AdminDashboard({ usuario, rol }) {
    const [activeSection, setActiveSection] = useState("Usuarios");
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAction = () => {
        setRefreshKey(prev => prev + 1);
        setFilter(f => f);
    };

    return (
        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar lateral */}
            <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">
                <Sidebar
                    usuario={usuario}
                    rol={rol}
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                />
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 flex flex-col p-6 bg-pageGradientInverse overflow-hidden">
                {activeSection === "Usuarios" && (
                    <>
                        <SummaryCards onFilter={setFilter} refreshKey={refreshKey} />
                        <div
                            className="flex-1 overflow-auto"
                            style={{ maxHeight: "calc(100vh - 16rem)" }} // header + footer
                        >
                            <UserTable filter={filter} onAction={handleAction} />
                        </div>
                    </>
                )}
                {/* Otras secciones */}
            </main>
        </div>
    );
}
