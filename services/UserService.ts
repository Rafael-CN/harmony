import { useAxios } from "./AxiosService";

const { put, post, get } = useAxios();

export interface ProfileData {
    displayName: string;
    profilePictureUrl: string;
    bio: string;
    status: {
        topArtists: Array<string>;
        topSongs: Array<string>;
        topGenres: Array<string>;
        likedCount: number;
    };
    followersCount: number;
    followingCount: number;
}

async function getUsername(): Promise<string> {
    const response = await get("user/name", true);
    return response.data.username;
}

async function getDisplayName(): Promise<string> {
    const response = await get("profile/name", true);
    return response.data.displayName;
}

async function getProfile(): Promise<ProfileData> {
    const response = await get("profile/me", true);
    return response.data;
}

async function updateProfile(displayName: string, bio: string): Promise<boolean> {
    const response = await put("profile/me", { displayName, bio }, true);
    return response.status === 200;
}

async function updateProfilePicture(fileUri: string): Promise<string | null> {
    const formData = new FormData();

    formData.append("file", {
        uri: fileUri,
        name: `profile_${Date.now()}.jpg`,
        type: "image/jpeg",
    } as any);

    try {
        const response = await post("profile/me/photo", formData, true, {
            "Content-Type": "multipart/form-data",
        });

        if (response.status === 200 && response.data.url) {
            return response.data.url;
        }

        return null;
    } catch (error) {
        console.error("Erro ao fazer upload da foto de perfil:", error);
        return null;
    }
}

export function useUser() {
    return {
        getUsername,
        getDisplayName,
        getProfile,
        updateProfile,
        updateProfilePicture,
    };
}
