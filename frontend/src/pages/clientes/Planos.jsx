// src/pages/clientes/Planos.jsx
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import api from "@/api/api";

export default function Planos() {
    const { activeSection, permisoActivo } = useOutletContext();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFiles = async () => {
            if (!permisoActivo) return;

            setLoading(true);
            setError("");

            try {
                const res = await api.get("/planos", {
                    params: {
                        empresa_id: permisoActivo.empresa_id,
                        subcarpeta: permisoActivo.subcarpeta,
                    },
                });
                setFiles(res.data);
            } catch (err) {
                console.error(err);
                setError("Error al cargar los archivos");
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [activeSection, permisoActivo]);

    if (loading) return <div>Cargando archivos...</div>;
    if (error) return <div className="text-red-600">{error}</div>;
    if (!files || files.length === 0) return <div>No hay archivos en esta subcarpeta</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((f) => (
                <a
                    key={f.name}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border rounded shadow hover:bg-gray-100"
                >
                    {f.name}
                </a>
            ))}
        </div>
    );
}
