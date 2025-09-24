// src/pages/admin/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/login/", { username, password });
            const { access_token, rol } = res.data;

            // Guardar token y rol
            localStorage.setItem("token", access_token);
            localStorage.setItem("rol", rol);

            // Redirigir según rol
            if (rol === "admin") navigate("/admin");
            else if (rol === "cliente") navigate("/cliente");
            else navigate("/");

        } catch (err) {
            console.error(err);
            const detail = err.response?.data?.detail;

            if (detail) {
                setError(Array.isArray(detail) ? detail.map(d => d.msg).join(", ") : detail);
            } else {
                setError("Error de conexión");
            }
        }
    };

    const handleSolicitarAcceso = () => {
        navigate("/register");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
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
                        className="bg-[#022CDC] text-white py-2 px-4 rounded hover:bg-[#022CDC] text-lg"
                    >
                        Entrar
                    </button>
                </form>
                {/* Botón siempre visible */}
                <button
                    onClick={handleSolicitarAcceso}
                    className="mt-4 w-full text-center text-black bg-[#022CDC]/25 py-2 rounded border-none cursor-pointer text-lg"
                >
                    Solicitar acceso
                </button>
            </div>
        </div>
    );
}
