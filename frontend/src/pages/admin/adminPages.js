// src/pages/admin/adminPages.js
import { Users, Building, Key } from "lucide-react";
import Usuarios from "@/pages/admin/Usuarios";
import Empresas from "@/pages/admin/Empresas";
import Permisos from "@/pages/admin/Permisos";

export const adminPages = [
    { name: "Usuarios", path: "usuarios", component: Usuarios, icon: Users },
    { name: "Empresas", path: "empresas", component: Empresas, icon: Building },
    { name: "Permisos", path: "permisos", component: Permisos, icon: Key },
];
