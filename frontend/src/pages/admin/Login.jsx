// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [modal, setModal] = useState({ visible: false, title: "", message: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/login/", { username, password });
            const { access_token, rol } = res.data;

            localStorage.setItem("token", access_token);
            localStorage.setItem("rol", rol);

            if (onLogin) onLogin(username, rol, username);

            if (rol === "admin") navigate("/admin");
            else if (rol === "cliente") navigate("/cliente");
            else navigate("/");

        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;
            if (detail) setError(Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : detail);
            else setError("Error de conexión");
        }
    };

    const handleSolicitarAcceso = () => navigate("/register");

    const handleResetPassword = async () => {
        setModal({ visible: true, title: "Resetear contraseña", message: "Ingresa tu usuario y recibirás un email con la contraseña temporal." });
    };

    const closeModal = () => setModal({ visible: false, title: "", message: "" });

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <Header />

            <main className="flex-1 flex flex-col justify-center items-center py-8 bg-pageGradient">
                <div className="w-full max-w-md p-6 bg-white/40 rounded shadow-md">
                    <h2 className="text-2xl text-center font-bold mb-4">Iniciar sesión</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border p-2 rounded"
                            required
                        />
                        {error && <div className="text-red-500">{error}</div>}
                        <button
                            type="submit"
                            className="bg-[#022CDC] text-white py-2 px-4 rounded hover:bg-[#021f9c] text-lg"
                        >
                            Entrar
                        </button>
                    </form>
                    <button
                        onClick={handleSolicitarAcceso}
                        className="mt-4 w-full text-center text-black bg-[#022CDC]/25 py-2 rounded border-none cursor-pointer text-lg"
                    >
                        Solicitar acceso
                    </button>
                    <button
                        onClick={handleResetPassword}
                        className="mt-2 w-full text-center text-white bg-blue-500 hover:bg-blue-600 py-2 rounded text-lg"
                    >
                        Resetear contraseña
                    </button>
                </div>

                {/* Modal */}
                {modal.visible && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
                            <h3 className="text-lg font-bold mb-4">{modal.title}</h3>
                            <p className="mb-6">{modal.message}</p>
                            <div className="flex justify-end gap-2">
                                <button
                                    className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={closeModal}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
