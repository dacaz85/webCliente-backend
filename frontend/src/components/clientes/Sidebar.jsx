// src/components/clientes/Sidebar.jsx
import { Home, FileText, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { name: "Inicio", icon: <Home size={18} />, path: "/cliente" },
        { name: "Planos", icon: <FileText size={18} />, path: "/cliente/planos" },
        { name: "Pedidos", icon: <ShoppingCart size={18} />, path: "/cliente/pedidos" },
    ];

    return (
        <div className="w-60 h-screen bg-gray-100 p-4">
            <h2 className="text-lg font-bold mb-6">Cliente Dashboard</h2>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.name} className={`mb-3 ${location.pathname === item.path ? "font-bold" : ""}`}>
                        <Link to={item.path} className="flex items-center gap-2">
                            {item.icon} {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
