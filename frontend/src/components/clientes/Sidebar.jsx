// src/components/clientes/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ permisos = [], activeSection, setActiveSection }) {
    const navigate = useNavigate();

    // Solo mostrar las subcarpetas que tengan checked === true
    const availableSections = permisos
        .filter(p => p.checked)
        .map(p => p.name);

    const handleClick = (section) => {
        setActiveSection(section);
        navigate(`/cliente/${section.toLowerCase()}`);
    };

    if (!availableSections.length) {
        return <div className="p-4 text-gray-500">No tiene permisos asignados</div>;
    }

    return (
        <aside className="w-64 min-w-[16rem] bg-pageGradientInverse shadow-md flex flex-col h-full p-6">
            <div className="mb-8 text-lg font-semibold">Panel Cliente</div>
            <nav className="flex flex-col gap-4">
                {availableSections.map((section) => (
                    <button
                        key={section}
                        onClick={() => handleClick(section)}
                        className={`flex items-center gap-2 text-left px-2 py-1 rounded ${activeSection === section
                                ? "bg-blue-100 font-semibold"
                                : "hover:text-blue-600"
                            }`}
                    >
                        {section}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
