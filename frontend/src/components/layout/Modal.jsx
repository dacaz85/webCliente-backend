// src/components/layout/Modal.jsx
import React from "react";

export default function Modal({ title, message, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                <pre className="bg-gray-100 p-2 rounded mb-4 whitespace-pre-wrap">{message}</pre>
                <button
                    onClick={onClose}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
}
