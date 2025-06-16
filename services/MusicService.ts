import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

export interface Music {
    id: string;
    name: string;
    artist: string;
    linkUrl: string;
    imageUrl: string;
}

export interface Artist {
    id: string;
    name: string;
    imageUrl: string;
    linkUrl: string;
}

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    const response = await get(`music/lastLiked?limit=${limit}`, true);
    return response.data;
}

async function getTopSongs(): Promise<Array<Music>> {
    const response = await get("music/top/songs", true);
    return response.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await get(`music/search?query=${query}&offset=${offset}`, true);
    return response.data;
}

async function getRecommendedSongs(seeds: Array<string>, limit: number = 5): Promise<Array<Music>> {
    const response = await get(`music/recommendations?seeds=${seeds.join(",")}&limit=${limit}`, true);
    return response.data;
}

async function getArtist(artistId: string): Promise<Artist> {
    const response = await get(`music/artist/${artistId}`, true);
    return response.data;
}

export function useMusic() {
    return {
        getLikedSongs,
        getTopSongs,
        getQuerySongs,
        getRecommendedSongs,
        getArtist,
    };
}
