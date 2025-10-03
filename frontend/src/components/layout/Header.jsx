// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adminPages } from "@/pages/admin/adminPages";
import api from "@/api/api";

export default function Header({ usuario, rol, onLogout, empresaSeleccionada, subcarpetaSeleccionada }) {
    const location = useLocation();
    const isLogged = !!usuario && !!onLogout;

    const [modal, setModal] = useState({
        visible: false,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        error: "",
        success: "",
    });

    const [centralTitle, setCentralTitle] = useState("Portal Clientes");

    // Recalcular el título dinámico cada vez que cambien las props o la ruta
    useEffect(() => {
        if (rol === "admin") {
            const activePage = adminPages.find(p => location.pathname.startsWith(`/admin/${p.path}`));
            setCentralTitle(activePage?.name || "Panel Administrador");
        } else if (rol === "cliente") {
            if (empresaSeleccionada && subcarpetaSeleccionada) {
                setCentralTitle(`${subcarpetaSeleccionada.name} — ${empresaSeleccionada.empresa_numero} ${empresaSeleccionada.empresa_nombre}`);
            } else if (empresaSeleccionada) {
                setCentralTitle(`${empresaSeleccionada.empresa_numero} ${empresaSeleccionada.empresa_nombre}`);
            } else {
                setCentralTitle("Portal Clientes");
            }
        }
    }, [rol, location.pathname, empresaSeleccionada, subcarpetaSeleccionada]);

    const openModal = () => setModal({ ...modal, visible: true, oldPassword: "", newPassword: "", confirmPassword: "", error: "", success: "" });
    const closeModal = () => setModal({ ...modal, visible: false });

    const handleChangePassword = async () => {
        setModal({ ...modal, error: "", success: "" });
        if (!modal.oldPassword || !modal.newPassword || !modal.confirmPassword) {
            setModal(prev => ({ ...prev, error: "Todos los campos son obligatorios" }));
            return;
        }
        if (modal.newPassword !== modal.confirmPassword) {
            setModal(prev => ({ ...prev, error: "Las contraseñas nuevas no coinciden" }));
            return;
        }

        try {
            await api.post(`/users/${usuario.id}/change-password`, {
                old_password: modal.oldPassword,
                new_password: modal.newPassword
            });
            setModal({ ...modal, success: "Contraseña actualizada correctamente", error: "" });
        } catch (err) {
            const detail = err.response?.data?.detail || "Error al actualizar la contraseña";
            setModal({ ...modal, error: detail, success: "" });
        }
    };

    return (
        <header className="h-16 flex items-center justify-between p-4 shadow-md font-sans bg-[#dc8502] z-10">
            {/* Logo */}
            <div className="text-4xl font-audiowide text-[#022CDC]">dacazMD</div>

            {/* Título dinámico */}
            <div className="text-2xl font-bold text-black text-center flex-1">{centralTitle}</div>

            {/* Usuario */}
            {isLogged && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            {usuario?.username?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="text-md">
                            <div className="font-medium">{usuario?.username || "Usuario"}</div>
                            <div className="text-s text-slate-500">{rol}</div>
                        </div>
                    </div>

                    <button
                        onClick={openModal}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                        Cambiar contraseña
                    </button>

                    <button
                        onClick={onLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Desconectar
                    </button>
                </div>
            )}

            {/* Modal cambio contraseña */}
            {modal.visible && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Cambiar contraseña</h3>
                        {modal.error && <p className="text-red-500 mb-2">{modal.error}</p>}
                        {modal.success && <p className="text-green-500 mb-2">{modal.success}</p>}
                        <input
                            type="password"
                            placeholder="Contraseña actual"
                            className="border p-2 rounded w-full mb-2"
                            value={modal.oldPassword}
                            onChange={e => setModal({ ...modal, oldPassword: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Nueva contraseña"
                            className="border p-2 rounded w-full mb-2"
                            value={modal.newPassword}
                            onChange={e => setModal({ ...modal, newPassword: e.target.value })}
                        />
                        <input
                            type="password"
                            placeholder="Confirmar nueva contraseña"
                            className="border p-2 rounded w-full mb-4"
                            value={modal.confirmPassword}
                            onChange={e => setModal({ ...modal, confirmPassword: e.target.value })}
                        />
                        <div className="flex justify-end gap-2">
                            <button className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400" onClick={closeModal}>
                                Cancelar
                            </button>
                            <button className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" onClick={handleChangePassword}>
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
