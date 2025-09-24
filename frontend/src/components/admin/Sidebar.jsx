// src/components/admin/Sidebar.jsx
import React from "react";
import { Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar({ usuario, rol, setActiveSection, activeSection }) {
    const isActive = (section) => activeSection === section;

    return (
        <aside className="w-64 min-w-[16rem] bg-white shadow-md flex flex-col h-screen p-6">
            <div className="mb-8">
                <div className="text-lg font-semibold">Panel Administrador</div>
            </div>
            <nav className="flex flex-col gap-4">
                <button
                    onClick={() => setActiveSection("Usuarios")}
                    className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Usuarios") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                >
                    <Users size={20} /> Usuarios
                </button>

                <Link
                    to="/admin/settings"
                    onClick={() => setActiveSection("Configuración")}
                    className={`flex items-center gap-2 px-2 py-1 rounded ${isActive("Configuración") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                >
                    <Settings size={20} /> Configuración
                </Link>
            </nav>
        </aside>
    );
}
