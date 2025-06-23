import { ProfileData } from "../types";
import { useAxios } from "./apiClient";

const axios = useAxios();

async function getProfile(): Promise<ProfileData> {
    const response = await axios.get("profile/me", true);
    return response?.data;
}

async function updateProfile(displayName: string, bio: string): Promise<boolean> {
    const response = await axios.put("profile/me", { displayName, bio }, true);
    return response?.status === 200;
}

async function updateProfileNowMusic(nowMusicId: string): Promise<boolean> {
    const response = await axios.put("profile/me", { nowMusicId }, true);
    return response?.status === 200;
}

async function updateProfilePicture(fileUri: string): Promise<string | null> {
    const formData = new FormData();

    formData.append("file", {
        uri: fileUri,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
    } as any);

    try {
        const response = await axios.post("profile/me/photo", formData, true, {
            "Content-Type": "multipart/form-data",
        });

        if (response && response.status === 200 && response.data.url) {
            return response.data.url;
        }

        return null;
    } catch (error) {
        console.error("Erro ao fazer upload da foto de perfil:", error);
        return null;
    }
}

async function followUser(username: string): Promise<boolean> {
    const response = await axios.post(`profile/follow/${username}`, {}, true);
    return response?.status === 200;
}

export function useUser() {
    return {
        getProfile,
        updateProfile,
        updateProfilePicture,
        updateProfileNowMusic,
        followUser,
    };
}
