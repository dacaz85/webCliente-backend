// src/pages/admin/Permisos.jsx
import React, { useState } from "react";
import PermisosTable from "@/components/admin/PermisosTable";

export default function Permisos() {
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);

    return (
        <div className="flex-1 p-6">
            <PermisosTable
                initialUserId={selectedUserId}
                initialEmpresaId={selectedEmpresaId}
            />
        </div>
    );
}
