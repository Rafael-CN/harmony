import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

async function getUsername(): Promise<string> {
    const response = await get("user/username", true);
    return response.data.username;
}

export function useUser() {
    return {
        getUsername,
    };
}
