import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

export interface Music {
    name: string;
    artist: string;

    imageUrl: string;
}

async function getLikedSongs(): Promise<Array<Music>> {
    const response = await get(`music/liked-songs`, true);
    return response.data;
}

async function getTopSongs(): Promise<Array<Music>> {
    const response = await get(`music/top-songs`, true);
    return response.data;
}

async function getQuerySongs(query: string, offset: number = 0): Promise<Array<Music>> {
    const response = await get(`music/query-songs?query=${query}&offset=${offset}`, true);
    return response.data;
}

export function useMusic() {
    return {
        getLikedSongs,
        getTopSongs,
        getQuerySongs,
    };
}
