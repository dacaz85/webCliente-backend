// src/components/clientes/Planos.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useSearchParams } from "react-router-dom";

export default function Planos({ usuario }) {
    const [searchParams] = useSearchParams();
    const empresaNombre = searchParams.get("empresa_nombre");
    const subcarpeta = searchParams.get("subcarpeta");

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFiles = async () => {
            if (!empresaNombre || !subcarpeta) return;

            try {
                setLoading(true);
                setError("");
                const res = await api.get("/planos/", {
                    params: { empresa_nombre: empresaNombre, subcarpeta },
                });
                setFiles(res.data);
            } catch (err) {
                console.error("Error cargando planos:", err);
                setError("No se pudieron cargar los archivos.");
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [empresaNombre, subcarpeta]);

    if (loading) return <div>Cargando archivos...</div>;
    if (error) return <div>{error}</div>;
    if (!files.length) return <div>No hay archivos en esta subcarpeta.</div>;

    return (
        <div className="grid grid-cols-3 gap-4">
            {files.map((file) => (
                <div key={file.name} className="p-2 border rounded">
                    <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {file.name}
                    </a>
                </div>
            ))}
        </div>
    );
}
