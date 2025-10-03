// src/components/admin/PermisosTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function PermisosTable({ initialUserId = null, initialEmpresaId = null }) {
    const [permisos, setPermisos] = useState([]);
    const [users, setUsers] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [subcarpetas, setSubcarpetas] = useState([]);
    const [selectedUser, setSelectedUser] = useState(initialUserId || "");
    const [selectedEmpresa, setSelectedEmpresa] = useState(initialEmpresaId || "");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const [deleteModal, setDeleteModal] = useState({ open: false, permisoId: null });

    // --- Cargar permisos ---
    const fetchPermisos = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedUser) params.append("user_id", selectedUser);
            if (selectedEmpresa) params.append("empresa_id", selectedEmpresa);
            if (search) params.append("search", search);

            const res = await api.get(`/user_permisos?${params.toString()}`);
            setPermisos(res.data);
        } catch (err) {
            console.error("Error al cargar permisos:", err);
            setPermisos([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Cargar usuarios (sin admins) ---
    const fetchUsers = async () => {
        try {
            const res = await api.get("/users/all");
            const filtered = (res.data || []).filter(u => u.rol !== "admin");
            setUsers(filtered);
        } catch {
            setUsers([]);
        }
    };

    // --- Cargar empresas ---
    const fetchEmpresas = async () => {
        try {
            const res = await api.get("/empresas/all");
            setEmpresas(res.data || []);
        } catch {
            setEmpresas([]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchEmpresas();
    }, []);

    useEffect(() => {
        fetchPermisos();
    }, [selectedUser, selectedEmpresa, search]);

    // --- Cargar subcarpetas al cambiar empresa o usuario ---
    useEffect(() => {
        const fetchSubcarpetas = async () => {
            if (!selectedEmpresa) {
                setSubcarpetas([]);
                return;
            }
            try {
                const res = await api.get(`/empresas/${selectedEmpresa}/subcarpetas`, {
                    params: { user_id: selectedUser || undefined }
                });
                setSubcarpetas(res.data || []);
            } catch (err) {
                console.error("Error al cargar subcarpetas:", err);
                setSubcarpetas([]);
            }
        };
        fetchSubcarpetas();
    }, [selectedEmpresa, selectedUser]);

    const clearFilters = () => {
        setSelectedUser("");
        setSelectedEmpresa("");
        setSearch("");
    };

    const handleCrearPermisos = () => setShowForm(!showForm);
    const handleUserChange = (e) => setSelectedUser(e.target.value);
    const handleEmpresaChange = (e) => setSelectedEmpresa(e.target.value);

    const handleSavePermisos = async () => {
        if (!selectedUser || !selectedEmpresa) {
            alert("Usuario y Empresa son obligatorios");
            return;
        }

        try {
            const data = {
                user_id: parseInt(selectedUser),
                empresa_id: parseInt(selectedEmpresa),
                subcarpetas: subcarpetas.map(s => ({ name: s.name, rol: s.rol || "lector" }))
            };
            await api.post("/user_permisos", data);
            setShowForm(false);
            fetchPermisos();
        } catch (err) {
            console.error("Error al guardar permisos:", err);
        }
    };

    const handleSubcarpetaCheck = (idx) => {
        const newSub = [...subcarpetas];
        newSub[idx].checked = !newSub[idx].checked;
        setSubcarpetas(newSub);
    };

    const handleSubcarpetaRol = (idx, rol) => {
        const newSub = [...subcarpetas];
        newSub[idx].rol = rol;
        setSubcarpetas(newSub);
    };

    const handleRoleChange = async (permisoId, rol) => {
        try {
            await api.put(`/user_permisos/${permisoId}`, { rol });
            fetchPermisos();
        } catch (err) {
            console.error(err);
        }
    };

    // --- Abrir modal eliminar ---
    const openDeleteModal = (permisoId) => {
        setDeleteModal({ open: true, permisoId });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ open: false, permisoId: null });
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/user_permisos/${deleteModal.permisoId}`);
            closeDeleteModal();
            fetchPermisos();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col">
            {/* --- Botones y filtros --- */}
            <div className="flex items-center gap-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${showForm ? "bg-red-500" : "bg-green-500"} text-white`}
                    onClick={handleCrearPermisos}
                >
                    {showForm ? "Cancelar" : "Crear Permisos"}
                </button>

                <input
                    type="text"
                    placeholder="Buscar usuario, email o empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-2 py-1 rounded flex-1"
                />

                <button
                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={clearFilters}
                >
                    Quitar filtros
                </button>
            </div>

            {/* --- Formulario crear permisos --- */}
            {showForm && (
                <div className="border p-4 mb-4 bg-white/50 rounded shadow">
                    <div className="flex flex-col gap-2 mb-2">
                        <select
                            value={selectedUser || ""}
                            onChange={handleUserChange}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">-- Seleccionar Usuario --</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.username} ({u.email})</option>)}
                        </select>

                        <select
                            value={selectedEmpresa || ""}
                            onChange={handleEmpresaChange}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">-- Seleccionar Empresa --</option>
                            {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                        </select>
                    </div>

                    {subcarpetas.length > 0 && (
                        <div className="mt-2 overflow-auto" style={{ maxHeight: '40vh' }}>                            
                            <table className="min-w border-separate border-spacing-0.5">
                                <thead className="bg-white/50">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Seleccionar</th>
                                        <th className="border px-4 py-2 text-left">Subcarpeta</th>
                                        <th className="border px-4 py-2 text-left">Rol</th>
                                    </tr>
                                </thead>
                                <tbody className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                                    {subcarpetas.map((s, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-4 py-2 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={s.checked}
                                                    onChange={() => handleSubcarpetaCheck(idx)}
                                                    className="scale-125"
                                                />
                                            </td>
                                            <td className="border px-4 py-2">{s.name}</td>
                                            <td className="border px-4 py-2">
                                                <select
                                                    value={s.rol}
                                                    onChange={(e) => handleSubcarpetaRol(idx, e.target.value)}
                                                    className="border px-2 py-1 rounded"
                                                >
                                                    <option value="lector">Lector</option>
                                                    <option value="editor">Editor</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSavePermisos}>Guardar Permisos</button>
                </div>
            )}

            {/* --- Listado permisos --- */}
            {loading && <div>Cargando permisos...</div>}
            {!loading && permisos.length === 0 && <div>No hay permisos que mostrar</div>}

            {!loading && permisos.length > 0 && (
                <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
                    <table className="min-w-full border-separate border-spacing-0.5">
                        <thead className="bg-white/50">
                            <tr>
                                <th className="border px-4 py-2 text-left">Usuario</th>
                                <th className="border px-4 py-2 text-left">Email</th>
                                <th className="border px-4 py-2 text-left">Empresa</th>
                                <th className="border px-4 py-2 text-left">Subcarpeta</th>
                                <th className="border px-4 py-2 text-left">Rol</th>
                                <th className="border px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                            {permisos.map((p) => (
                                <tr key={p.id}>
                                    <td className="border px-4 py-2">{p.username || "—"}</td>
                                    <td className="border px-4 py-2">{p.email || "—"}</td>
                                    <td className="border px-4 py-2">{p.empresa_nombre || "—"}</td>
                                    <td className="border px-4 py-2">{p.subcarpeta || "—"}</td>
                                    <td className="border px-4 py-2">
                                        <select
                                            value={p.rol || "lector"}
                                            onChange={(e) => handleRoleChange(p.id, e.target.value)}
                                            className="border px-2 py-1 rounded"
                                        >
                                            <option value="lector">Lector</option>
                                            <option value="editor">Editor</option>
                                        </select>
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() => openDeleteModal(p.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- Modal eliminar --- */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow p-6 w-96">
                        <h3 className="font-bold mb-4">Confirmar eliminación</h3>
                        <p className="mb-4">¿Estás seguro de que deseas eliminar este permiso?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={closeDeleteModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
