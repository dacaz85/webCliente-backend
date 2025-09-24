// src/components/admin/Header.jsx
import React from 'react';

export default function Header({ usuario, rol, activeSection }) {
    return (
        <header className="h-16 flex items-center justify-between p-4 border-b bg-white">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">{activeSection || "Panel Administrador"}</h2>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                        {usuario?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="text-sm">
                        <div className="font-medium">{usuario}</div>
                        <div className="text-xs text-slate-500">{rol}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
