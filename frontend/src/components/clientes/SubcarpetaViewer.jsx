import React, { useEffect, useState } from "react";
import FileList from "@/components/clientes/FileList";
import PreviewPanel from "@/components/cliente/PreviewPanel";
import api from "@/api/api";


export default function SubcarpetaViewer({ empresaSeleccionada, subcarpetaSeleccionada }) {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (!empresaSeleccionada || !subcarpetaSeleccionada) return;

        const fetchFiles = async () => {
            try {
                const res = await api.get("/subcarpetaviewer/", {
                    params: {
                        empresa_id: empresaSeleccionada.id,
                        subcarpeta: subcarpetaSeleccionada,
                    },
                });

                // Prepend download URLs
                const filesWithUrl = res.data.map((f) => ({
                    ...f,
                    url: `/subcarpetaviewer/download/${empresaSeleccionada.id}/${subcarpetaSeleccionada}/${encodeURIComponent(f.name)}`,
                }));

                setFiles(filesWithUrl);
                setSelectedFile(filesWithUrl[0] || null);
            } catch (err) {
                console.error("Error cargando archivos:", err);
            }
        };

        fetchFiles();
    }, [empresaSeleccionada, subcarpetaSeleccionada]);

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <FileList files={files} onSelect={setSelectedFile} selectedFile={selectedFile} />
            <PreviewPanel file={selectedFile} />
        </div>
    );
}
