import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface AuthResponse {
    token: string;
    succeeded: boolean;
}

async function postApi(route: string, data: any, useAuth: boolean = false): Promise<AxiosResponse> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.post(`${API_BASE_URL}/${route}`, data, {
            headers: {
                Authorization: useAuth ? `Bearer ${userToken}` : undefined,
            },
            validateStatus: (status) => status > 199 && status < 500,
        });

        return response;
    } catch (error) {
        console.error("Error posting to API:", error);
        throw error;
    }
}

async function getApi(route: string, useAuth: boolean = false): Promise<AxiosResponse> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/${route}`, {
            headers: {
                Authorization: useAuth ? `Bearer ${userToken}` : undefined,
            },
            validateStatus: (status) => status > 199 && status < 500,
        });

        return response;
    } catch (error) {
        console.error("Error getting from API:", error);
        throw error;
    }
}

async function login(username: string, password: string): Promise<AuthResponse> {
    const response = await postApi("user/login", { username, password });

    return {
        token: response.data.token,
        succeeded: response.status == 200,
    };
}

async function register(username: string, password: string): Promise<AuthResponse> {
    const response = await postApi("user/register", { username, password });

    return {
        token: response.data.token,
        succeeded: response.status == 200,
    };
}

async function isLoggedIn(): Promise<boolean> {
    const response = await getApi("user/logged-in", true);
    return response.data.isLoggedIn;
}

async function isLinkedSpotify(): Promise<boolean> {
    const response = await getApi("user/spotify-linked", true);
    return response.data.isLinked;
}

async function linkSpotify(authCode: string): Promise<boolean> {
    const response = await postApi("user/spotify-link", { authCode }, true);
    return response.status === 200;
}

export function useAuth() {
    return {
        login,
        register,
        isLoggedIn,
        linkSpotify,
        isLinkedSpotify,
    };
}
