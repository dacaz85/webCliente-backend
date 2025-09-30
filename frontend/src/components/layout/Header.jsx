// src/components/layout/Header.jsx
import React from "react";

export default function Header({ usuario, rol, activeSection, onLogout }) {
    const isLogged = !!usuario && !!onLogout;

    // Título central según rol
    const centralTitle =
        rol === "admin"
            ? activeSection || "Panel Administrador"
            : "Portal Clientes";

    return (
        <header className="h-16 flex items-center justify-between p-4 shadow-md font-sans bg-[#dc8502] z-10">
            {/* Izquierda: Logo */}
            <div className="text-4xl font-audiowide text-[#022CDC]">dacazMD</div>

            {/* Centro: Título dinámico */}
            <div className="text-2xl font-bold text-black text-center flex-1">
                {centralTitle}
            </div>

            {/* Derecha: Usuario + rol + desconectar */}
            {isLogged && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            {(typeof usuario === "string"
                                ? usuario.charAt(0).toUpperCase()
                                : "U")}
                        </div>
                        <div className="text-md">
                            <div className="font-medium">{typeof usuario === "string" ? usuario : usuario?.username || "Usuario"}</div>
                            <div className="text-s text-slate-500">{rol}</div>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Desconectar
                    </button>
                </div>
            )}
        </header>
    );
}
