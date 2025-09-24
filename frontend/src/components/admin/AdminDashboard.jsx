// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import UserTable from "./UserTable";
import Footer from "../layout/Footer";

export default function AdminDashboard({ usuario, rol }) {
    const [activeSection, setActiveSection] = useState("Usuarios");
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAction = () => {
        setRefreshKey(prev => prev + 1);
        setFilter(f => f);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header usuario={usuario} rol={rol} activeSection={activeSection} />

            <div className="flex flex-1 w-full">
                <Sidebar
                    usuario={usuario}
                    rol={rol}
                    setActiveSection={setActiveSection}
                    activeSection={activeSection}
                />

                <main className="flex-1 p-6 space-y-6 bg-pageGradient w-full overflow-auto">
                    {activeSection === "Usuarios" && (
                        <>
                            <SummaryCards onFilter={setFilter} refreshKey={refreshKey} />
                            <UserTable filter={filter} onAction={handleAction} />
                        </>
                    )}
                    {/* Aquí puedes añadir más secciones si lo deseas */}
                </main>
            </div>

            <Footer />
        </div>
    );
}
