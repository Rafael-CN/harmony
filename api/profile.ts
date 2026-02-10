import api from "./api";
import { ProfileData } from "../types";

async function getProfile(): Promise<ProfileData> {
    const response = await api.get("profile/me");
    return response.data;
}

async function updateProfile(displayName: string, bio: string): Promise<boolean> {
    try {
        const response = await api.put("profile/me", { displayName, bio });
        return response.status === 200;
    } catch {
        return false;
    }
}

async function updateProfileNowMusic(nowMusicId: string): Promise<boolean> {
    try {
        const response = await api.put("profile/me", { nowMusicId });
        return response.status === 200;
    } catch {
        return false;
    }
}

async function updateProfilePicture(fileUri: string): Promise<string | null> {
    const formData = new FormData();

    formData.append("file", {
        uri: fileUri,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
    } as any); // React Native FormData accepts objects with uri/name/type, but DOM types don't support this

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
    } catch {
        return null;
    }
}

async function followUser(username: string): Promise<{ isMatch: boolean; succeeded: boolean }> {
    try {
        const response = await api.post(`profile/follow/${username}`, {});

        return {
            isMatch: response.data.isMatch,
            succeeded: response.status === 200,
        };
    } catch {
        return {
            isMatch: false,
            succeeded: false,
        };
    }
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
