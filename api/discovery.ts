import { useAxios } from "./apiClient";
import { RecommendedMusic, RecommendedUser } from "../types";

const axios = useAxios();

async function getRecommendedUsers(
    page: number = 1,
    pageSize: number = 10
): Promise<RecommendedUser[]> {
    const response = await axios.get(`discovery/users?page=${page}&pageSize=${pageSize}`, true);
    return response?.data || [];
}

async function getRecommendedMusics(): Promise<RecommendedMusic[]> {
    const response = await axios.get(`discovery/music`, true);
    return response?.data || [];
}

async function getRecommendedSeeds(seeds: string[]): Promise<RecommendedMusic[]> {
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
