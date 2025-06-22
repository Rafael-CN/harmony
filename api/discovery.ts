import { useAxios } from "./apiClient";
import { Music, RecommendedUser } from "../types";

const axios = useAxios();

async function getRecommendedUsers(
    page: number = 1,
    pageSize: number = 10
): Promise<RecommendedUser[]> {
    const response = await axios.get(`discovery/users?page=${page}&pageSize=${pageSize}`, true);
    return response?.data || [];
}

async function getRecommendedMusics(limit: number = 5): Promise<Music[]> {
    const response = await axios.get(`discovery/music?limit=${limit}`, true);
    return response?.data || [];
}

async function getRecommendedSeeds(seeds: string[]): Promise<Music[]> {
    const response = await axios.get(`discovery/music/seeds?s=${seeds.join(",")}`, true);
    return response?.data || [];
}

export function useDiscovery() {
    return {
        getRecommendedUsers,
        getRecommendedMusics,
        getRecommendedSeeds,
    };
}
