// src/components/admin/UserTable.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

export default function UserTable({ filter, onAction }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ visible: false, title: "", message: "", onConfirm: null });
    const containerRef = useRef(null);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get("/users/all");
            let data = res.data || [];

            if (filter && filter !== "todos") {
                if (filter === "pendiente") data = data.filter(u => !u.activo);
                else if (filter === "activo") data = data.filter(u => u.activo);
            }

            setUsers(data);
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, [filter]);

    const handleAction = async (callback) => {
        await callback();
        fetchUsers();
        if (onAction) onAction();
    };

    const showConfirmModal = (title, message, onConfirm) => {
        setModal({ visible: true, title, message, onConfirm });
    };

    const closeModal = () => setModal({ visible: false, title: "", message: "", onConfirm: null });

    const validateUser = (id) =>
        handleAction(() => api.post(`/users/${id}/validate`).catch(console.error));

    const deleteUser = (user) => {
        showConfirmModal(
            `Eliminar usuario ${user.username}?`,
            "Esta acción es irreversible",
            () => handleAction(() => api.delete(`/users/${user.id}`).catch(console.error))
        );
    };

    const elevateUser = (user) => {
        const newRole = user.rol === "admin" ? "cliente" : "admin";

        showConfirmModal(
            `${newRole === "admin" ? "Elevar a Admin" : "Pasar a Cliente"} - ${user.username}`,
            `¿Deseas realmente cambiar el rol de ${user.username} a ${newRole}?`,
            () => handleAction(() =>
                api.post(`/users/${user.id}/set-role`, { role: newRole })
                    .then(response => { user.rol = response.data.rol; })
                    .catch(console.error)
            )
        );
    };

    const resetPassword = (user) => {
        showConfirmModal(
            `Resetear contraseña - ${user.username}`,
            "Se generará una contraseña temporal que se mostrará al finalizar",
            async () => {
                await handleAction(async () => {
                    const res = await api.post(`/users/${user.id}/reset-password`);
                    alert(`Contraseña temporal: ${res.data.temp_password}`);
                });
            }
        );
    };

    const goToPermisos = (user) => {
        if (onAction) {
            // Forzamos que se reseteen los IDs de empresa
            onAction({ section: "Permisos", userId: user.id, empresaId: null });
        }
    };

    if (loading) return <div>Cargando usuarios...</div>;
    if (!users || users.length === 0) return <div>No hay usuarios que mostrar</div>;

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-auto"
            style={{ maxHeight: 'calc(100vh - 16rem)' }}
        >
            <table className="min-w-full bg-white/50 border">
                <thead>
                    <tr>
                        <th className="border px-4 py-2 text-left">ID</th>
                        <th className="border px-4 py-2 text-left">Usuario</th>
                        <th className="border px-4 py-2 text-left">Email</th>
                        <th className="border px-4 py-2 text-left">Activo</th>
                        <th className="border px-4 py-2 text-left">Rol</th>
                        <th className="border px-4 py-2 text-left">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td className="border px-4 py-2">{u.id}</td>
                            <td className="border px-4 py-2">{u.username}</td>
                            <td className="border px-4 py-2">{u.email}</td>
                            <td className="border px-4 py-2">{u.activo ? "Sí" : "No"}</td>
                            <td className="border px-4 py-2">{u.rol}</td>
                            <td className="border px-4 py-2 flex gap-2 flex-wrap">
                                {!u.activo && (
                                    <button
                                        onClick={() => validateUser(u.id)}
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                        Validar
                                    </button>
                                )}
                                <button
                                    onClick={() => elevateUser(u)}
                                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                    {u.rol === "admin" ? "Pasar a Cliente" : "Elevar a Admin"}
                                </button>
                                <button
                                    onClick={() => resetPassword(u)}
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                >
                                    Resetear contraseña
                                </button>
                                <button
                                    onClick={() => deleteUser(u)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Eliminar
                                </button>
                                {u.rol === "cliente" && (
                                    <button
                                        onClick={() => goToPermisos(u)}
                                        className="bg-purple-500 text-white px-2 py-1 rounded"
                                    >
                                        Permisos
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {modal.visible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">{modal.title}</h3>
                        <p className="mb-6">{modal.message}</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={closeModal}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                onClick={() => {
                                    modal.onConfirm();
                                    closeModal();
                                }}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
