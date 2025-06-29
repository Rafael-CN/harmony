import api from "./api";
import { ProfileData } from "../types";

async function getProfile(): Promise<ProfileData> {
    const response = await api.get("profile/me");
    return response?.data;
}

async function updateProfile(displayName: string, bio: string): Promise<boolean> {
    const response = await api.put("profile/me", { displayName, bio });
    return response?.status === 200;
}

async function updateProfileNowMusic(nowMusicId: string): Promise<boolean> {
    const response = await api.put("profile/me", { nowMusicId });
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
        const response = await api.post("profile/me/photo", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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

async function followUser(username: string): Promise<{ isMatch: boolean; succeeded: boolean }> {
    const response = await api.post(`profile/follow/${username}`, {});

    return {
        isMatch: response?.data.isMatch,
        succeeded: response?.status == 200,
    };
}

export function useProfileApi() {
    return {
        getProfile,
        updateProfile,
        updateProfilePicture,
        updateProfileNowMusic,
        followUser,
    };
}
