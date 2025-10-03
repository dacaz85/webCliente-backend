// src/components/admin/Sidebar.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { adminPages } from "@/pages/admin/adminPages";

export default function Sidebar({ permisos }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleClick = (path) => navigate(`/admin/${path}`);

    return (
        <aside className="w-64 bg-pageGradientInverse p-6 flex flex-col h-full gap-4">
            <h2 className="font-bold mb-4">Panel Administrador</h2>
            {adminPages.map((p) => {
                const isActive = location.pathname.startsWith(`/admin/${p.path}`);
                const Icon = p.icon;
                return (
                    <button
                        key={p.path}
                        onClick={() => handleClick(p.path)}
                        className={`flex items-center gap-2 px-2 py-1 rounded ${isActive ? "bg-blue-100 font-semibold" : "hover:bg-blue-200"
                            }`}
                    >
                        {Icon && <Icon size={20} />}
                        {p.name}
                    </button>
                );
            })}
        </aside>
    );
}
