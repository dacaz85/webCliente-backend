// src/components/admin/UserTable.jsx
import React, { useEffect, useState } from "react";
import api from "@/api/api";

export default function UserTable({ filter, onAction }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);
        api.get("/users/all")
            .then(res => {
                let data = res.data || [];
                if (filter && filter !== "todos") {
                    if (filter === "pendiente") data = data.filter(u => !u.activo);
                    else if (filter === "activo") data = data.filter(u => u.activo);
                }
                setUsers(data);
            })
            .catch(err => { console.error(err); setUsers([]); })
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, [filter]);

    const handleAction = async (callback) => {
        await callback();
        fetchUsers();
        if (onAction) onAction();
    };

    const validateUser = (id) => handleAction(() => api.post(`/users/${id}/validate`).catch(console.error));
    const blockUser = (id) => handleAction(() => api.post(`/users/${id}/block`).catch(console.error));
    const deleteUser = (id) => handleAction(() => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return Promise.resolve();
        return api.delete(`/users/${id}`).catch(console.error);
    });

    if (loading) return <div>Cargando usuarios...</div>;
    if (!users || users.length === 0) return <div>No hay usuarios que mostrar</div>;

    return (
        <table className="min-w-full bg-white border">
            <thead>
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Usuario</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Activo</th>
                    <th className="border px-4 py-2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td className="border px-4 py-2">{u.id}</td>
                        <td className="border px-4 py-2">{u.username}</td>
                        <td className="border px-4 py-2">{u.email}</td>
                        <td className="border px-4 py-2">{u.activo ? "Sí" : "No"}</td>
                        <td className="border px-4 py-2">
                            {!u.activo && <button onClick={() => validateUser(u.id)} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Validar</button>}
                            {u.activo && <button onClick={() => blockUser(u.id)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Bloquear</button>}
                            <button onClick={() => deleteUser(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
