import api from "./api";
import { Artist, Music } from "../types";

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    const response = await api.get("music/liked", { params: { limit } });
    return response?.data;
}

async function setLikedSongs(songIds: Array<string>): Promise<void> {
    const response = await api.post("music/liked", { songIds });
    return response?.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await api.get("music/search", { params: { query, offset } });
    return response?.data;
}

async function getArtists(artistIds: Array<string>): Promise<Array<Artist>> {
    const response = await api.get("music/artists", { params: { ids: artistIds.join(",") } });
    return response?.data;
}

async function getSongPreview(songId: string): Promise<string> {
    const response = await api.get(`music/${songId}/preview`);
    return response?.data.url;
}

export function useMusicApi() {
    return {
        getLikedSongs,
        getQuerySongs,
        getArtists,
        getSongPreview,
    };
}
