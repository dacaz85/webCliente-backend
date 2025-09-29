// src/components/admin/EmpresaTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function EmpresaTable({ filter, onAction, setActiveSection }) {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ visible: false, title: "", onConfirm: null });

    const [formData, setFormData] = useState({
        numero: "",
        nombre: "",
        activo: true,
    });

    const [editId, setEditId] = useState(null);
    const [subcarpetas, setSubcarpetas] = useState([]);

    // Obtener empresas
    const fetchEmpresas = async () => {
        setLoading(true);
        try {
            const res = await api.get("/empresas/all");
            setEmpresas(res.data || []);
        } catch (err) {
            console.error(err);
            setEmpresas([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEmpresas(); }, [filter]);

    const handleAction = async (callback) => {
        await callback();
        fetchEmpresas();
        if (onAction) onAction();
    };

    // Abrir modal
    const showModal = (title, onConfirm, empresa = null) => {
        if (empresa) {
            setFormData({
                numero: empresa.numero,
                nombre: empresa.nombre,
                activo: empresa.activo,
            });
            setEditId(empresa.id);
        } else {
            setFormData({ numero: "", nombre: "", activo: true });
            setEditId(null);
        }
        setModal({ visible: true, title, onConfirm });
    };

    const closeModal = () => {
        setModal({ visible: false, title: "", onConfirm: null });
        setFormData({ numero: "", nombre: "", activo: true });
        setEditId(null);
    };

    // Guardar empresa
    const handleSave = () => {
        if (!formData.numero || !formData.nombre) {
            alert("Número y nombre son obligatorios");
            return;
        }

        if (!/^\d{4}$/.test(formData.numero)) {
            alert("Número debe tener 4 dígitos numéricos");
            return;
        }

        const dataToSend = {
            ...formData,
            carpeta_base: `${formData.numero} ${formData.nombre}`,
        };

        if (editId) {
            handleAction(() => api.put(`/empresas/${editId}`, dataToSend));
        } else {
            handleAction(() => api.post("/empresas", dataToSend));
        }

        closeModal();
    };

    // Eliminar empresa
    const handleDelete = (empresa) => {
        if (window.confirm(`¿Seguro que quieres eliminar la empresa "${empresa.nombre}"?`)) {
            handleAction(() => api.delete(`/empresas/${empresa.id}`));
        }
    };

    // Redirigir a permisos filtrando por empresa
    const handlePermisos = (empresaId) => {
        if (setActiveSection) {
            setActiveSection("Permisos", { empresaId });
        }
    };

    // Obtener subcarpetas desde backend
    const handleSubcarpetas = async (empresaId) => {
        try {
            const res = await api.get(`/empresas/${empresaId}/subcarpetas`);
            setSubcarpetas(res.data || []);
            if (!res.data || res.data.length === 0) alert("No hay subcarpetas");
        } catch (err) {
            console.error(err);
            alert("Error al obtener subcarpetas");
            setSubcarpetas([]);
        }
    };

    if (loading) return <div>Cargando empresas...</div>;
    if (!empresas || empresas.length === 0) return <div>No hay empresas que mostrar</div>;

    return (
        <>
            <div className="mb-4">
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={() => showModal("Crear nueva empresa", handleSave)}
                >
                    Crear Empresa
                </button>
            </div>

            <table className="min-w-full bg-white/50 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Número</th>
                        <th className="border px-4 py-2">Nombre</th>
                        <th className="border px-4 py-2">Carpeta Base</th>
                        <th className="border px-4 py-2">Activo</th>
                        <th className="border px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {empresas.map((e) => (
                        <tr key={e.id}>
                            <td className="border px-4 py-2">{e.id}</td>
                            <td className="border px-4 py-2">{e.numero}</td>
                            <td className="border px-4 py-2">{e.nombre}</td>
                            <td className="border px-4 py-2">{e.carpeta_base}</td>
                            <td className="border px-4 py-2">{e.activo ? "Sí" : "No"}</td>
                            <td className="border px-4 py-2 flex gap-2 flex-wrap">
                                <button
                                    onClick={() => showModal(`Editar empresa ${e.nombre}`, handleSave, e)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(e)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handlePermisos(e.id)}
                                    className="bg-purple-500 text-white px-2 py-1 rounded"
                                >
                                    Permisos
                                </button>
                                <button
                                    onClick={() => handleSubcarpetas(e.id)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Ver Subcarpetas
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mostrar subcarpetas */}
            {subcarpetas.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-bold">Subcarpetas:</h4>
                    <ul className="list-disc ml-6">
                        {subcarpetas.map((s, idx) => (
                            <li key={idx}>{s}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Modal */}
            {modal.visible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">{modal.title}</h3>
                        <div className="flex flex-col gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Número (4 dígitos)"
                                value={formData.numero}
                                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.activo}
                                    onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                />
                                Activo
                            </label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                onClick={handleSave}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
