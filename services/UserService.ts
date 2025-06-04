import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function getUsername(): Promise<string> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/user/username`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error getting user:", error);
        throw error;
    }
}

export function useUser() {
    return {
        getUsername,
    };
}
