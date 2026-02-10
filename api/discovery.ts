import api from "./api";
import { Music, RecommendedUser } from "../types";

async function getRecommendedUsers(
    page: number = 1,
    pageSize: number = 10
): Promise<RecommendedUser[]> {
    const response = await api.get("discovery/users", { params: { page, pageSize } });
    return response?.data || [];
}

async function getRecommendedMusics(limit: number = 5): Promise<Music[]> {
    const response = await api.get("discovery/music", { params: { limit } });
    return response?.data || [];
}

async function getRecommendedSeeds(seeds: string[]): Promise<Music[]> {
    const response = await api.get("discovery/music/seeds", { params: { s: seeds.join(",") } });
    return response?.data || [];
}

export function useDiscoveryApi() {
    return {
        getRecommendedUsers,
        getRecommendedMusics,
        getRecommendedSeeds,
    };
}
