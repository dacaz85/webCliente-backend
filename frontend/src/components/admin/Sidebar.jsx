// src/components/admin/Sidebar.jsx
import React from "react";
import { Users, Building, Key } from "lucide-react";

export default function Sidebar({ usuario, rol, setActiveSection, activeSection }) {
    const isActive = (section) => activeSection === section;

    return (
        <aside className="w-64 min-w-[16rem] bg-pageGradientInverse shadow-md flex flex-col h-full p-6">
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

                <button
                    onClick={() => setActiveSection("Empresas")}
                    className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Empresas") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                >
                    <Building size={20} /> Empresas
                </button>

                <button
                    onClick={() => setActiveSection("Permisos")}
                    className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Permisos") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                >
                    <Key size={20} /> Permisos
                </button>
            </nav>
        </aside>
    );
}
