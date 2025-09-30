import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ShoppingCart } from "lucide-react";

export default function Sidebar({ permisos = [], activeSection, setActiveSection }) {
    const navigate = useNavigate();

    if (!permisos || permisos.length === 0) return null;

    return (
        <aside className="w-64 min-w-[16rem] bg-pageGradientInverse shadow-md flex flex-col h-full p-6">
            <div className="mb-8">
                <div className="text-lg font-semibold">Panel Cliente</div>
            </div>

            <nav className="flex flex-col gap-4">
                {permisos.map((p) => {
                    const isActive = activeSection === p.subcarpeta;
                    let icon = <FileText size={20} />;
                    if (p.subcarpeta.toLowerCase() === "pedidos") icon = <ShoppingCart size={20} />;

                    return (
                        <button
                            key={p.subcarpeta}
                            onClick={() => {
                                setActiveSection(p.subcarpeta);
                                navigate(`/cliente/${p.subcarpeta.toLowerCase()}`);
                            }}
                            className={`flex items-center gap-2 px-2 py-1 rounded ${isActive ? "bg-blue-100 font-semibold" : "hover:text-blue-600"}`}
                        >
                            {icon} {p.subcarpeta}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
