import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

async function getUsername(): Promise<string> {
    const response = await get("user/name", true);
    return response.data.username;
}

async function getDisplayName(): Promise<string> {
    const response = await get("profile/name", true);
    return response.data.displayName;
}

export function useUser() {
    return {
        getUsername,
        getDisplayName,
    };
}
