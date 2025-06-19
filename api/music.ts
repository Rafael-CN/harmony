import { Artist, Music } from "../types";
import { useAxios } from "./apiClient";

const axios = useAxios();

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    const response = await axios.get(`music/liked/last?limit=${limit}`, true);
    return response?.data;
}

async function getTopSongs(): Promise<Array<Music>> {
    const response = await axios.get("music/top/songs", true);
    return response?.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await axios.get(`music/search?query=${query}&offset=${offset}`, true);
    return response?.data;
}

async function getArtist(artistId: string): Promise<Artist> {
    const response = await axios.get(`music/artist/${artistId}`, true);
    return response?.data;
}

async function getTrackPreview(trackId: string): Promise<string> {
    const response = await axios.get(`music/${trackId}/preview`, true);
    return response?.data.url;
}

export function useMusic() {
    return {
        getLikedSongs,
        getTopSongs,
        getQuerySongs,
        getArtist,
        getTrackPreview,
    };
}
