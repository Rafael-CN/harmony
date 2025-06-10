import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

export interface Music {
    name: string;
    artist: string;
    linkUrl: string;
    imageUrl: string;
}

async function getLikedSongs(limit: number = 5): Promise<Array<Music>> {
    const response = await get(`spotify/lastLiked?limit=${limit}`, true);
    return response.data;
}

async function getTopSongs(): Promise<Array<Music>> {
    const response = await get("spotify/topSongs", true);
    return response.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await get(`spotify/search?query=${query}&offset=${offset}`, true);
    return response.data;
}

export function useMusic() {
    return {
        getLikedSongs,
        getTopSongs,
        getQuerySongs,
    };
}
