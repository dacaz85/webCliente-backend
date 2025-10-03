import React, { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.js?url"; // ⚠️ Correcto para Vite

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PreviewPanel({ file }) {
    const canvasRef = useRef();

    useEffect(() => {
        if (!file) return;

        const renderPDF = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument(file.url);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1.0 });
                const canvas = canvasRef.current;
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
            } catch (error) {
                console.error("Error renderizando PDF:", file.name, error);
            }
        };

        if (file.name.toLowerCase().endsWith(".pdf")) {
            renderPDF();
        }
    }, [file]);

    if (!file) return <div>Selecciona un archivo</div>;
    if (file.name.toLowerCase().endsWith(".pdf")) return <canvas ref={canvasRef}></canvas>;

    return (
        <img
            src={file.url}
            alt={file.name}
            style={{ maxWidth: "100%", maxHeight: "400px", objectFit: "contain" }}
        />
    );
}
