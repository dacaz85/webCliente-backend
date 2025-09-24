// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "@/pages/admin/Login";
import Register from "@/pages/admin/Register";
import AdminDashboard from "@/components/admin/AdminDashboard";
import ClienteDashboard from "@/components/clientes/ClienteDashboard";
import Planos from "@/pages/clientes/Planos";
import Pedidos from "@/pages/clientes/Pedidos";
import { setToken } from "@/api/api";

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
                {/* Header */}
                <header className="flex justify-center items-center p-4 shadow-md font-sans bg-[#dc8502] z-10">
                    <div className="absolute left-4 text-4xl font-audiowide text-[#022CDC]">dacazMD</div>
                    <div className="text-4xl font-bold text-black">Portal Clientes</div>
                    {userLogged && (
                        <button
                            onClick={handleLogout}
                            className="absolute right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Desconectar
                        </button>
                    )}
                </header>

                {/* Main: contenido con scroll si es necesario */}
                <main className="flex-1 overflow-auto bg-pageGradient flex justify-center items-center">
                    <Routes>
                        {/* Login */}
                        <Route path="/" element={
                            userLogged ? (
                                userRol === "admin" ? <Navigate to="/admin" /> : <Navigate to="/cliente" />
                            ) : <Login onLogin={handleLogin} />
                        } />

                        {/* Registro */}
                        <Route path="/register" element={
                            userLogged ? <Navigate to="/" /> : <Register />
                        } />

                        {/* Dashboard Admin */}
                        <Route path="/admin/*" element={
                            userLogged && userRol === "admin" ? <AdminDashboard usuario={user} rol={userRol} /> : <Navigate to="/" />
                        } />

                        {/* Dashboard Cliente */}
                        <Route path="/cliente/*" element={
                            userLogged && userRol === "cliente" ? <ClienteDashboard usuario={user} rol={userRol} /> : <Navigate to="/" />
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
