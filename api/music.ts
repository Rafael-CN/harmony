import api from "./api";
import { Artist, Music } from "../types";

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    try {
        const response = await api.get("music/liked", { params: { limit } });
        return response?.data;
    } catch {
        return [];
    }
}

async function setLikedSongs(songIds: Array<string>): Promise<void> {
    try {
        const response = await api.post("music/liked", { songIds });
        return response?.data;
    } catch {
        // silencioso
    }
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    try {
        const response = await api.get("music/search", { params: { query, offset } });
        return response?.data;
    } catch {
        return [];
    }
}

async function getArtists(artistIds: Array<string>): Promise<Array<Artist>> {
    try {
        const response = await api.get("music/artists", { params: { ids: artistIds.join(",") } });
        return response?.data;
    } catch {
        return [];
    }
}

async function getSongPreview(songId: string): Promise<string> {
    try {
        const response = await api.get(`music/${songId}/preview`);
        return response?.data.url;
    } catch {
        return "";
    }
}

export function useMusicApi() {
    return {
        getLikedSongs,
        setLikedSongs,
        getQuerySongs,
        getArtists,
        getSongPreview,
    };
}
