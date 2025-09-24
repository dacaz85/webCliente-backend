// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SummaryCards from "./SummaryCards";
import UserTable from "./UserTable";

export default function AdminDashboard({ usuario, rol }) {
    const [activeSection, setActiveSection] = useState("Usuarios");
    const [filter, setFilter] = useState("todos");
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAction = () => {
        setRefreshKey(prev => prev + 1);
        setFilter(f => f);
    };

    return (
        <div className="flex h-screen w-screen bg-gray-100">
            <Sidebar usuario={usuario} rol={rol} setActiveSection={setActiveSection} activeSection={activeSection} />
            <div className="flex flex-col flex-1">
                <Header usuario={usuario} rol={rol} activeSection={activeSection} />
                <main className="flex flex-col flex-1 p-6 space-y-6 overflow-auto">
                    {activeSection === "Usuarios" && (
                        <>
                            <SummaryCards onFilter={setFilter} refreshKey={refreshKey} />
                            <UserTable filter={filter} onAction={handleAction} />
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
