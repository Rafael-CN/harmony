import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    validateStatus: (status) => status > 199 && status < 500,
});

export const setAuthToken = (token: string | null) => {
    if (!token) {
        delete api.defaults.headers.common["Authorization"];
        return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
