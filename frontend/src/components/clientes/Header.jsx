// src/components/clientes/Header.jsx
export default function Header({ usuario }) {
    return (
        <div className="w-full h-16 bg-white shadow flex items-center justify-between px-4">
            <h1 className="text-xl font-bold">Bienvenido, {usuario}</h1>
        </div>
    );
}
