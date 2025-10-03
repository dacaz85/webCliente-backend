// src/pages/clientes/Planos.jsx
import React from "react";
import { useOutletContext } from "react-router-dom";
import SubcarpetaViewer from "@/components/clientes/SubcarpetaViewer";

export default function Planos() {
    const { empresaSeleccionada, subcarpetaSeleccionada } = useOutletContext();

    if (!empresaSeleccionada || !subcarpetaSeleccionada) {
        return <div>Selecciona una empresa y una subcarpeta para ver su contenido</div>;
    }

    return (
        <div className="p-4 flex-1 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">
                {subcarpetaSeleccionada.name} - {empresaSeleccionada.empresa_nombre}
            </h2>
            <SubcarpetaViewer
                empresaSeleccionada={empresaSeleccionada}
                subcarpetaSeleccionada={subcarpetaSeleccionada}
            />
        </div>
    );
}
