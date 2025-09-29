// src/components/admin/PermisosTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function PermisosTable() {
    const [permisos, setPermisos] = useState([]);
    const [users, setUsers] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [subcarpetas, setSubcarpetas] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        user_id: "",
        empresa_id: "",
        subcarpetas: []
    });

    // Cargar datos iniciales
    const fetchData = async () => {
        try {
            const [permRes, usersRes, empresasRes] = await Promise.all([
                api.get("/user_permisos/all"),
                api.get("/users/all"),
                api.get("/empresas/all")
            ]);
            setPermisos(permRes.data || []);
            setUsers(usersRes.data || []);
            setEmpresas(empresasRes.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Cambiar usuario
    const handleUserChange = (e) => {
        setFormData({ ...formData, user_id: e.target.value, subcarpetas: [] });
        setSubcarpetas([]);
    };

    // Cambiar empresa
    const handleEmpresaChange = async (e) => {
        const empresa_id = e.target.value;
        setFormData({ ...formData, empresa_id, subcarpetas: [] });

        if (empresa_id) {
            try {
                const res = await api.get(`/empresas/${empresa_id}/subcarpetas`);
                const subs = res.data.map((s) => ({ name: s, rol: "lector" }));
                setSubcarpetas(subs);
                setFormData((prev) => ({ ...prev, subcarpetas: subs }));
            } catch (err) {
                console.error(err);
                setSubcarpetas([]);
            }
        }
    };

    // Cambiar rol de subcarpeta
    const handleRolChange = (index, rol) => {
        const newSubcarpetas = [...formData.subcarpetas];
        newSubcarpetas[index].rol = rol;
        setFormData({ ...formData, subcarpetas: newSubcarpetas });
    };

    // Guardar permisos
    const handleSave = async (e) => {
        e.preventDefault();
        if (!formData.user_id || !formData.empresa_id) {
            alert("Selecciona usuario y empresa");
            return;
        }

        // Filtrar subcarpetas marcadas
        const subsToSend = formData.subcarpetas.filter((s) => s.rol !== "");

        if (subsToSend.length === 0) {
            alert("Marca al menos una subcarpeta con rol");
            return;
        }

        try {
            await api.post("/user_permisos", { ...formData, subcarpetas: subsToSend });
            setShowForm(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Error al guardar permisos");
        }
    };

    return (
        <div>
            <button
                className={`px-4 py-2 rounded ${showForm ? "bg-red-500" : "bg-green-500"} text-white mb-4`}
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? "Cancelar" : "Crear Permisos"}
            </button>

            {showForm && (
                <form onSubmit={handleSave} className="p-4 border rounded bg-white/50 shadow space-y-4">
                    <div className="flex gap-4">
                        <select
                            value={formData.user_id}
                            onChange={handleUserChange}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">Selecciona usuario</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>

                        <select
                            value={formData.empresa_id}
                            onChange={handleEmpresaChange}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">Selecciona empresa</option>
                            {empresas.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                    </div>

                    {subcarpetas.length > 0 && (
                        <div className="space-y-2">
                            {subcarpetas.map((s, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={formData.subcarpetas[idx].rol !== ""}
                                        onChange={(e) => {
                                            handleRolChange(idx, e.target.checked ? "lector" : "");
                                        }}
                                    />
                                    <span className="flex-1">{s.name}</span>
                                    <select
                                        value={formData.subcarpetas[idx].rol}
                                        onChange={(e) => handleRolChange(idx, e.target.value)}
                                        className="border px-2 py-1 rounded"
                                    >
                                        <option value="lector">Lector</option>
                                        <option value="editor">Editor</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                        Guardar Permisos
                    </button>
                </form>
            )}

            <table className="min-w-full border bg-white/50 mt-4">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Usuario</th>
                        <th className="border px-4 py-2">Empresa</th>
                        <th className="border px-4 py-2">Subcarpeta</th>
                        <th className="border px-4 py-2">Rol</th>
                        <th className="border px-4 py-2">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {permisos.map((p) => (
                        <tr key={p.id}>
                            <td className="border px-4 py-2">{p.username}</td>
                            <td className="border px-4 py-2">{p.empresa_nombre}</td>
                            <td className="border px-4 py-2">{p.subcarpeta}</td>
                            <td className="border px-4 py-2">{p.rol}</td>
                            <td className="border px-4 py-2">{p.fecha_asignacion}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
