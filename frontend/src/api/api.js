import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
    },
});

let token = null;

export const setToken = (newToken) => {
    token = newToken;
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

// Función para obtener permisos de cliente pasando userId
export const getPermisosCliente = async (userId) => {
    try {
        const res = await api.get("/permisos/", {
            params: { user_id: userId },
        });
        return res.data;
    } catch (err) {
        console.error("Error obteniendo permisos:", err);
        throw err;
    }
};

// Interceptor para añadir token en cada request
api.interceptors.request.use((config) => {
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default api;
