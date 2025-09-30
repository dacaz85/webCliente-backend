//src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "@/pages/admin/Login";
import Register from "@/pages/admin/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ClienteDashboard from "@/components/clientes/ClienteDashboard";
import Planos from "@/pages/clientes/Planos";
import Pedidos from "@/pages/clientes/Pedidos";
import { setToken } from "@/api/api";

export default function App() {
    const [userLogged, setUserLogged] = useState(false);
    const [userRol, setUserRol] = useState(""); // 'admin' o 'cliente'
    const [usuario, setUsuario] = useState({ id: null, username: "" });

    const handleLogin = (userData) => {
        setUserLogged(true);
        setUserRol(userData.rol || "");
        setUsuario({
            id: userData.id || null,
            username: userData.username || userData.user || "Usuario"
        });
        setToken(userData.token || null);
    };

    const handleLogout = () => {
        setUserLogged(false);
        setUserRol("");
        setUsuario({ id: null, username: "" });
        setToken(null);
    };

    return (
        <Router>
            <Routes>
                {/* Login */}
                <Route
                    path="/"
                    element={
                        userLogged
                            ? userRol === "admin"
                                ? <Navigate to="/admin" />
                                : <Navigate to="/cliente" />
                            : <Login onLogin={handleLogin} />
                    }
                />

                {/* Registro */}
                <Route
                    path="/register"
                    element={userLogged ? <Navigate to="/" /> : <Register />}
                />

                {/* Dashboard Admin */}
                <Route
                    path="/admin/*"
                    element={
                        userLogged && userRol === "admin"
                            ? <AdminDashboard
                                usuario={usuario}
                                rol={userRol}
                                onLogout={handleLogout}
                            />
                            : <Navigate to="/" />
                    }
                />

                {/* Dashboard Cliente */}
                <Route
                    path="/cliente/*"
                    element={
                        userLogged && userRol === "cliente"
                            ? <ClienteDashboard
                                usuario={usuario}
                                rol={userRol}
                                onLogout={handleLogout}
                            />
                            : <Navigate to="/" />
                    }
                >
                    <Route path="planos" element={<Planos />} />
                    <Route path="pedidos" element={<Pedidos />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
