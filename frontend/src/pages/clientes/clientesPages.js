// src/pages/clientes/clientesPages.js
import { DraftingCompass, ShoppingCart, Ticket } from "lucide-react";
import Planos from "@/pages/clientes/Planos";
import Pedidos from "@/pages/clientes/Pedidos";
import Certificados from "@/pages/clientes/Certificados";

export const clientesPages = [
    { name: "Planos", path: "planos", component: Planos, icon: DraftingCompass },
    { name: "Pedidos", path: "pedidos", component: Pedidos, icon: ShoppingCart },
    { name: "Certificados", path: "certificados", component: Certificados, icon: Ticket },
];
