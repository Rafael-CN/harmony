import { Artist, Music } from "../types";
import { useAxios } from "./apiClient";

const axios = useAxios();

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    const response = await axios.get(`music/liked?limit=${limit}`, true);
    return response?.data;
}

async function setLikedSongs(songIds: Array<string>): Promise<void> {
    const response = await axios.post(`music/liked`, { songIds }, true);
    return response?.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await axios.get(`music/search?query=${query}&offset=${offset}`, true);
    return response?.data;
}

async function getArtists(artistIds: Array<string>): Promise<Array<Artist>> {
    const response = await axios.get(`music/artists?ids=${artistIds.join(",")}`, true);
    return response?.data;
}

async function getSongPreview(songId: string): Promise<string> {
    const response = await axios.get(`music/${songId}/preview`, true);
    return response?.data.url;
}

export function useMusic() {
    return {
        getLikedSongs,
        getQuerySongs,
        getArtists,
        getSongPreview,
    };
}
