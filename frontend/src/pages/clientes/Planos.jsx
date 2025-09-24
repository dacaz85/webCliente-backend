// src/pages/clientes/Planos.jsx
import { useEffect, useState } from "react";
import api from "@/api/api";

export default function Planos() {
    const [planos, setPlanos] = useState([]);

    useEffect(() => {
        api.get("/planos/empresas")
            .then(res => setPlanos(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Planos disponibles</h2>
            {planos.map((p) => (
                <div key={p.id} className="mb-6">
                    <h3 className="font-semibold">{p.nombre}</h3>
                    <ul className="list-disc list-inside">
                        {p.files?.map((archivo, i) => <li key={i}>{archivo}</li>)}
                    </ul>
                </div>
            ))}
        </div>
    );
}
