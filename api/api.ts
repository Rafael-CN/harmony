import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorized = (callback: () => void) => {
    onUnauthorizedCallback = callback;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            onUnauthorizedCallback?.();
        }
        return Promise.reject(error);
    }
);

export const setAuthToken = (token: string | null) => {
    if (!token) {
        delete api.defaults.headers.common["Authorization"];
        return;
    }

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
