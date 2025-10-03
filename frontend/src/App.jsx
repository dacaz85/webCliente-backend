import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Public pages
import Login from "@/pages/public/Login";
import Register from "@/pages/public/Register";

// Dashboards
import AdminDashboard from "@/components/admin/AdminDashboard";
import ClienteDashboard from "@/components/clientes/ClienteDashboard";

// Cliente pages
import { clientesPages } from "@/pages/clientes/clientesPages";

// Admin pages
import { adminPages } from "@/pages/admin/adminPages";

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [logoutTimer, setLogoutTimer] = useState(null);
    const [modal, setModal] = useState({ visible: false, title: "", message: "" });

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("user_id");
        setUsuario(null);
        if (logoutTimer) {
            clearTimeout(logoutTimer);
            setLogoutTimer(null);
        }
    };

    const showSessionExpiredModal = () => {
        setModal({
            visible: true,
            title: "Sesión expirada",
            message: "Tu sesión ha caducado. Por favor, vuelve a iniciar sesión."
        });
    };

    const closeModal = () => setModal({ ...modal, visible: false });

    const handleLogin = (userData) => {
        setUsuario(userData);

        if (logoutTimer) {
            clearTimeout(logoutTimer);
            setLogoutTimer(null);
        }

        if (userData.token) {
            try {
                const payload = JSON.parse(atob(userData.token.split(".")[1]));
                const now = Math.floor(Date.now() / 1000);
                const exp = payload.exp && payload.exp > now ? payload.exp : now + 900;
                const expireInMs = (exp - now) * 1000;

                const timer = setTimeout(() => {
                    handleLogout();
                    showSessionExpiredModal();
                }, expireInMs);

                setLogoutTimer(timer);
            } catch (e) {
                console.error("Error leyendo token", e);
                handleLogout();
            }
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("usuario");
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            handleLogin(userData);
        }
        return () => logoutTimer && clearTimeout(logoutTimer);
    }, []);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <Header usuario={usuario} rol={usuario?.rol} onLogout={handleLogout} />

                <main className="flex-1 flex flex-col">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                usuario ? (
                                    usuario.rol === "admin" ? (
                                        <Navigate to="/admin/usuarios" />
                                    ) : (
                                        <Navigate to="/cliente/planos" />
                                    )
                                ) : (
                                    <Login onLogin={handleLogin} />
                                )
                            }
                        />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/admin/*"
                            element={
                                usuario?.rol === "admin" ? (
                                    <AdminDashboard usuario={usuario} rol={usuario.rol} onLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        >
                            {adminPages.map((p) => (
                                <Route key={p.path} path={p.path} element={<p.component />} />
                            ))}
                            <Route index element={<Navigate to="usuarios" replace />} />
                        </Route>

                        <Route
                            path="/cliente/*"
                            element={
                                usuario?.rol === "cliente" ? (
                                    <ClienteDashboard usuario={usuario} onLogout={handleLogout} />
                                ) : (
                                    <Navigate to="/" />
                                )
                            }
                        >
                            {clientesPages.map((p) => (
                                <Route key={p.path} path={p.path} element={<p.component />} />
                            ))}
                            <Route index element={<Navigate to="planos" replace />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>

                <Footer />

                {modal.visible && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                            <h3 className="text-lg font-bold mb-4">{modal.title}</h3>
                            <p className="mb-6">{modal.message}</p>
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BrowserRouter>
    );
}
