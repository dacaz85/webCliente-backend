import React from "react";

export default function FileList({ files, onSelect, selectedFile }) {
    return (
        <div style={{ width: "200px", overflowY: "auto", maxHeight: "80vh" }}>
            {files.map((file) => (
                <div
                    key={file.name}
                    onClick={() => onSelect(file)}
                    style={{
                        padding: "5px",
                        cursor: "pointer",
                        backgroundColor: selectedFile?.name === file.name ? "#d3d3d3" : "transparent",
                    }}
                >
                    {file.name}
                </div>
            ))}
        </div>
    );
}
