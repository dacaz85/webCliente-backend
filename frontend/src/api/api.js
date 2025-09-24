// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    headers: {
        "Content-Type": "application/json",
    },
});

export const setToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
};

export default api;
