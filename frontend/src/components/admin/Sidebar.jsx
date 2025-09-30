// src/components/admin/Sidebar.jsx
import React from "react";
import { Users, Building, Key } from "lucide-react";

export default function Sidebar({ usuario, rol, setActiveSection, activeSection, permisos = [] }) {
    const isActive = (section) => activeSection === section;

    // Normalizamos permisos: siempre array de strings
    const normalizedPermisos = (permisos || []).map(p => {
        if (typeof p === "string") return p;
        if (p && p.subcarpeta) return p.subcarpeta;
        return "";
    }).filter(Boolean);

    return (
        <aside className="w-64 min-w-[16rem] bg-pageGradientInverse shadow-md flex flex-col h-full p-6">
            <div className="mb-8">
                <div className="text-lg font-semibold">Panel Administrador</div>
            </div>
            <nav className="flex flex-col gap-4">
                {/* Usuarios */}
                {normalizedPermisos.includes("Usuarios") || rol === "admin" ? (
                    <button
                        onClick={() => setActiveSection("Usuarios")}
                        className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Usuarios") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                    >
                        <Users size={20} /> Usuarios
                    </button>
                ) : null}

                {/* Empresas */}
                {normalizedPermisos.includes("Empresas") || rol === "admin" ? (
                    <button
                        onClick={() => setActiveSection("Empresas")}
                        className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Empresas") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                    >
                        <Building size={20} /> Empresas
                    </button>
                ) : null}

                {/* Permisos */}
                {normalizedPermisos.includes("Permisos") || rol === "admin" ? (
                    <button
                        onClick={() => setActiveSection("Permisos")}
                        className={`flex items-center gap-2 text-left px-2 py-1 rounded ${isActive("Permisos") ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                    >
                        <Key size={20} /> Permisos
                    </button>
                ) : null}
            </nav>
        </aside>
    );
}
