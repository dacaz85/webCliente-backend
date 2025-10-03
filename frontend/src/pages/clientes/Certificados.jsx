// src/pages/clientes/Certificados.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";
import { useOutletContext } from "react-router-dom";

export default function Certificados() {
    const { usuario } = useOutletContext();
    const [certificados, setCertificados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                const res = await api.get("/certificados", { params: { user_id: usuario.id } });
                setCertificados(res.data || []);
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar los certificados");
            } finally {
                setLoading(false);
            }
        };
        fetchCertificados();
    }, [usuario.id]);

    if (loading) return <div>Cargando certificados...</div>;
    if (error) return <div>{error}</div>;
    if (!certificados.length) return <div>No hay certificados disponibles</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificados.map(c => (
                <div key={c.id} className="border p-2 rounded hover:shadow-md">
                    Certificado #{c.id} - {c.tipo || "Desconocido"}
                </div>
            ))}
        </div>
    );
}
