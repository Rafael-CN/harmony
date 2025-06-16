import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function put(route: string, data: any, useAuth: boolean = false): Promise<AxiosResponse> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.put(`${API_BASE_URL}/${route}`, data, {
            headers: {
                Authorization: useAuth ? `Bearer ${userToken}` : undefined,
            },
            validateStatus: (status) => status > 199 && status < 500,
        });
        return response;
    } catch (error) {
        console.error("Error putting to API:", error);
        throw error;
    }
}

async function post(route: string, data: any, useAuth: boolean = false, headers: any = {}): Promise<AxiosResponse> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.post(`${API_BASE_URL}/${route}`, data, {
            headers: {
                Authorization: useAuth ? `Bearer ${userToken}` : undefined,
                ...headers,
            },
            validateStatus: (status) => status > 199 && status < 500,
        });

        return response;
    } catch (error) {
        console.error("Error posting to API:", error);
        throw error;
    }
}

async function get(route: string, useAuth: boolean = false): Promise<AxiosResponse> {
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

export function useAxios() {
    return {
        put,
        post,
        get,
    };
}
