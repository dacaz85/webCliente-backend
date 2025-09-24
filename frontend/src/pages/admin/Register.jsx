// src/pages/admin/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMsg("");

        // Validaciones frontend
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        try {
            const res = await api.post("/register/", {
                username,
                email,
                password,
            });

            setMsg(res.data.msg || "Registro exitoso, espera validación del admin");
            setUsername("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
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

    return (
        <div className="flex flex-col justify-center items-center w-full h-full py-8">
            <div className="w-full max-w-md p-6 bg-white/40 rounded shadow-md">
                <h2 className="text-2xl text-center font-bold mb-4">Solicitar acceso</h2>

                {error && <div className="text-red-500 mb-2">{error}</div>}
                {msg && <div className="text-green-500 mb-2">{msg}</div>}

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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <input
                        type="password"
                        placeholder="Confirmar Contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#022CDC] text-white py-2 px-4 rounded hover:bg-[#021f9c] text-lg"
                    >
                        Solicitar acceso
                    </button>
                </form>

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 w-full text-center text-black bg-[#022CDC]/25 py-2 rounded border-none cursor-pointer text-lg"
                >
                    Volver al login
                </button>
            </div>
        </div>
    );
}
