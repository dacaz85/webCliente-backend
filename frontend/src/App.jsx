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
            <div className="flex flex-col h-screen">
                <header className="relative flex justify-center items-center p-4 bg-[#ADADAD] shadow-md font-sans">
                    <div className="absolute left-4 text-4xl font-audiowide text-[#022CDC]">dacazMD</div>
                    <div className="text-4xl font-bold">Portal Clientes</div>
                    {userLogged && (
                        <button
                            onClick={handleLogout}
                            className="absolute right-4 bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Desconectar
                        </button>
                    )}
                </header>
                <main className="flex-1 flex justify-center items-center bg-gray-100">
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
            </div>
        </Router>
    );
}
