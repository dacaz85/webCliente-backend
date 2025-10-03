// src/components/clientes/Sidebar.jsx
import React from "react";

export default function Sidebar({
    empresas,
    empresaSeleccionada,
    setEmpresaSeleccionada,
    subcarpetaSeleccionada,
    setSubcarpetaSeleccionada
}) {
    // Mapa subcarpeta → empresas
    const subcarpetasMap = {};
    empresas.forEach((empresa) => {
        empresa.subcarpetas.forEach((sub) => {
            if (!subcarpetasMap[sub.name]) subcarpetasMap[sub.name] = [];
            subcarpetasMap[sub.name].push(empresa);
        });
    });

    const handleEmpresaClick = (subName, empresa) => {
        setSubcarpetaSeleccionada({ name: subName });
        setEmpresaSeleccionada(empresa);
    };

    return (
        <aside className="w-64 bg-pageGradientInverse p-6 flex flex-col h-full gap-4 overflow-auto">
            <h2 className="text-lg font-bold mb-4">Panel Cliente</h2>
            <ul>
                {Object.entries(subcarpetasMap).map(([subName, associatedEmpresas]) => (
                    <li key={subName}>
                        <div
                            className={`px-2 py-1 mb-1 font-semibold ${subcarpetaSeleccionada?.name === subName ? "bg-blue-500 text-white rounded" : ""
                                }`}
                        >
                            {subName}
                        </div>
                        <ul className="ml-4 mt-1">
                            {associatedEmpresas.map((empresa) => (
                                <li key={empresa.empresa_id}>
                                    <button
                                        onClick={() => handleEmpresaClick(subName, empresa)}
                                        className={`w-full text-left px-2 py-1 rounded mb-1 ${empresaSeleccionada?.empresa_id === empresa.empresa_id &&
                                                subcarpetaSeleccionada?.name === subName
                                                ? "bg-blue-300 font-semibold"
                                                : "hover:bg-blue-50"
                                            }`}
                                    >
                                        {empresa.empresa_nombre}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
