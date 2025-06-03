import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface LoginResponse {
    token: string;
    succeeded: boolean;
}

async function login(username: string, password: string): Promise<LoginResponse> {
    try {
        const response = await axios({
            method: "post",
            url: `${API_BASE_URL}/user/login`,
            data: {
                username,
                password,
            },
            validateStatus: (status) => status === 200 || status === 401,
        });

        return {
            token: response.data.token,
            succeeded: response.status == 200,
        };
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

async function register(username: string, password: string): Promise<boolean> {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/register`, { username, password });
        console.log("Register response:", response.data);

        return response.status === 200;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
}

async function isLinkedSpotify(): Promise<boolean> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/user/spotify-linked`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });
        console.log("Is Linked Spotify response:", response.data);

        return response.data.isLinked;
    } catch (error) {
        console.error("Error checking if Spotify is linked:", error);
        throw error;
    }
}

async function linkSpotify(authCode: string): Promise<boolean> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.post(
            `${API_BASE_URL}/user/spotify-link`,
            { authCode },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            }
        );
        console.log("Link Spotify response:", response.data);

        return response.status === 200;
    } catch (error) {
        console.error("Error linking Spotify:", error);
        throw error;
    }
}

export function useAuth() {
    return {
        login,
        register,
        linkSpotify,
        isLinkedSpotify,
    };
}
