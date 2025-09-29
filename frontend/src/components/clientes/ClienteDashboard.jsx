// src/components/clientes/ClienteDashboard.jsx
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Outlet } from "react-router-dom";

export default function ClienteDashboard({ usuario, rol, onLogout }) {
    // Si quieres secciones laterales, puedes añadirlas aquí
    const [activeSection, setActiveSection] = useState("Inicio");

    return (
        <div className="flex flex-col min-h-screen w-screen">
            {/* Header dinámico */}
            <Header usuario={usuario} rol={rol} activeSection={activeSection} onLogout={onLogout} />

            {/* Contenedor principal */}
            <div className="flex flex-1 overflow-hidden">
                {/* Si quieres sidebar, la puedes poner aquí */}
                {/* <aside className="flex-shrink-0 overflow-auto w-64 min-w-[16rem]">Sidebar</aside> */}

                {/* Contenido principal */}
                <main className="flex-1 flex flex-col p-6 bg-pageGradient overflow-hidden">
                    {/* Wrapper scrollable */}
                    <div className="flex-1 overflow-auto">
                        {/* Aquí se renderizan las rutas hijas como Planos, Pedidos */}
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Footer fijo */}
            <Footer />
        </div>
    );
}
