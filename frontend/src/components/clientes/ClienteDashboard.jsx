// src/components/clientes/ClienteDashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "@/components/layout/Header";

export default function ClienteDashboard({ usuario, rol }) {
    return (
        <div className="flex h-screen">
            <Header usuario={usuario} rol={rol} activeSection={activeSection} onLogout={onLogout} />
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header usuario={usuario} rol={rol} />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
