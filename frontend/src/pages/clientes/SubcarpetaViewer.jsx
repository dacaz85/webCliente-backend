// src/pages/clientes/SubcarpetaViewer.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/api";

export default function SubcarpetaViewer() {
    const { subcarpeta } = useParams(); // "planos", "certificados", "pedidos", etc.
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Pedidos no carga archivos
                if (subcarpeta.toLowerCase() === "pedidos") {
                    setFiles([]);
                    return;
                }
                const res = await api.get("/files", { params: { subcarpeta } });
                setFiles(res.data);
            } catch (err) {
                console.error(`Error cargando archivos de ${subcarpeta}:`, err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [subcarpeta]);

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center">
                Cargando {subcarpeta}...
            </div>
        );
    }

    // ✅ Caso especial: PEDIDOS
    if (subcarpeta.toLowerCase() === "pedidos") {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Pedidos</h2>
                <p>Aquí irá el formulario de pedidos (pendiente de definir).</p>
            </div>
        );
    }

    // ✅ Caso especial: CERTIFICADOS
    if (subcarpeta.toLowerCase() === "certificados") {
        return (
            <div>
                <h2 className="text-2xl font-bold mb-4">Certificados</h2>
                {files.length === 0 ? (
                    <p>No hay archivos disponibles.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {files.map((file) => (
                            <div
                                key={file.name}
                                className="flex justify-between items-center border rounded p-2 shadow-sm"
                            >
                                <span>{file.name}</span>
                                <a
                                    href={file.url}
                                    download={file.name}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Descargar
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ✅ Caso especial: PLANOS (previsualización + descarga)
    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-4">{subcarpeta}</h2>

            {files.length === 0 ? (
                <p>No hay archivos disponibles.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {files.map((file) => (
                        <div
                            key={file.name}
                            className="border rounded shadow p-2 cursor-pointer hover:shadow-lg flex flex-col items-center"
                            onClick={() => setSelectedFile(file)}
                        >
                            {/\.(jpg|jpeg)$/i.test(file.name) ? (
                                <img
                                    src={file.url}
                                    alt={file.name}
                                    className="w-full h-48 object-cover rounded mb-2"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-48 bg-gray-100 mb-2 rounded">
                                    <span className="text-gray-500 font-semibold">PDF</span>
                                </div>
                            )}
                            <div className="text-center truncate">{file.name}</div>
                            <a
                                href={file.url}
                                download={file.name}
                                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Descargar
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para previsualizar (solo Planos) */}
            {selectedFile && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setSelectedFile(null)}
                >
                    <div
                        className="bg-white rounded shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{selectedFile.name}</h3>
                            <button
                                onClick={() => setSelectedFile(null)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Cerrar
                            </button>
                        </div>

                        {/\.(jpg|jpeg)$/i.test(selectedFile.name) ? (
                            <img
                                src={selectedFile.url}
                                alt={selectedFile.name}
                                className="w-full object-contain"
                            />
                        ) : (
                            <iframe
                                src={selectedFile.url}
                                title={selectedFile.name}
                                className="w-full h-[80vh]"
                            />
                        )}

                        <a
                            href={selectedFile.url}
                            download={selectedFile.name}
                            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Descargar
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
