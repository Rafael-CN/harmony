import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface Music {
    name: string;
    artist: string;

    imageUrl: string;
}

async function getLikedSongs(): Promise<Array<Music>> {
    try {
        const userToken = await AsyncStorage.getItem("token");

        const response = await axios.get(`${API_BASE_URL}/music/last-liked`, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error getting liked songs:", error);
        throw error;
    }
}

export function useMusic() {
    return {
        getLikedSongs,
    };
}
