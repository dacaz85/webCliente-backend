// src/components/layout/Header.jsx
import React from "react";

export default function Header({ usuario, rol, activeSection, onLogout }) {
    const isLogged = !!usuario;

    // Determinar título dinámico según rol
    const getTitle = () => {
        if (rol === "admin") {
            return activeSection || "Panel Administrador";
        } else if (rol === "cliente") {
            return "Portal Clientes";
        } else {
            return "Portal Clientes";
        }
    };

    return (
        <header className="h-16 flex items-center justify-between p-4 shadow-md font-sans bg-[#dc8502] z-10">
            {/* Logo + título */}
            <div className="flex items-center gap-4">
                <div className="text-4xl font-audiowide text-[#022CDC]">dacazMD</div>
                <div className="text-3xl font-bold text-black">Portal Clientes</div>
                <div className="text-2xl font-bold text-black">{getTitle()}</div>
            </div>

            {/* Usuario + logout */}
            {isLogged && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            {usuario?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="text-md">
                            <div className="font-medium">{usuario}</div>
                            <div className="text-s text-slate-500">{rol}</div>
                        </div>
                    </div>

                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Desconectar
                        </button>
                    )}
                </div>
            )}
        </header>
    );
}
