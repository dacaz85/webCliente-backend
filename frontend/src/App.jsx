// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "@/pages/admin/Login";
import Register from "@/pages/admin/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ClienteDashboard from "@/components/clientes/ClienteDashboard";
import Planos from "@/pages/clientes/Planos";
import Pedidos from "@/pages/clientes/Pedidos";
import { setToken } from "@/api/api";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function App() {
    const [userLogged, setUserLogged] = useState(false);
    const [userRol, setUserRol] = useState(""); // 'admin' o 'cliente'
    const [user, setUser] = useState(""); // nombre de usuario

    const handleLogin = (usuario, rol, nombre) => {
        setUserLogged(true);
        setUserRol(rol);
        setUser(nombre || usuario);
    };

    const handleLogout = () => {
        setUserLogged(false);
        setUserRol("");
        setUser("");
        setToken(null); // limpia el token de axios
    };

    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                {/* Header único */}
                <Header
                    usuario={user}
                    rol={userRol}
                    onLogout={userLogged ? handleLogout : null}
                />

                {/* Main sin centrado forzado */}
                <main className="flex-1 overflow-auto bg-pageGradient">
                    <Routes>
                        {/* Login */}
                        <Route path="/" element={
                            userLogged ? (
                                userRol === "admin" ? <Navigate to="/admin" /> : <Navigate to="/cliente" />
                            ) : (
                                <div className="flex justify-center items-center" style={{ minHeight: 'calc(100vh - 8rem)' }}>
                                    <Login onLogin={handleLogin} />
                                </div>
                            )
                        } />

                        {/* Registro */}
                        <Route path="/register" element={
                            userLogged ? <Navigate to="/" /> : (
                                <div className="flex justify-center items-center h-full" style={{ minHeight: 'calc(100vh - 8rem)' }}>
                                    <Register />
                                </div>
                            )
                        } />

                        {/* Dashboard Admin */}
                        <Route path="/admin/*" element={
                            userLogged && userRol === "admin"
                                ? <AdminDashboard usuario={user} rol={userRol} />
                                : <Navigate to="/" />
                        } />

                        {/* Dashboard Cliente */}
                        <Route path="/cliente/*" element={
                            userLogged && userRol === "cliente"
                                ? <ClienteDashboard usuario={user} rol={userRol} />
                                : <Navigate to="/" />
                        }>
                            <Route path="planos" element={<Planos />} />
                            <Route path="pedidos" element={<Pedidos />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>

                {/* Footer fijo */}
                <Footer />
            </div>
        </Router>
    );
}
