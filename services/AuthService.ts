import { useAxios } from "./AxiosService";

const { post, get } = useAxios();

export interface AuthResponse {
    token: string;
    succeeded: boolean;
}
async function login(username: string, password: string): Promise<AuthResponse> {
    const response = await post("user/login", { username, password });

    return {
        token: response.data.token,
        succeeded: response.status == 200,
    };
}

async function register(username: string, password: string): Promise<any> {
    const response = await post("user/register", { username, password });

    return {
        errors: response.data.errors,
        succeeded: response.status == 200,
    };
}

async function isLoggedIn(): Promise<boolean> {
    const response = await get("user/logged-in", true);
    return response.data.isLoggedIn;
}

async function isLinkedSpotify(): Promise<boolean> {
    const response = await get("user/spotify/isLinked", true);
    return response.data.isLinked;
}

async function linkSpotify(authCode: string): Promise<boolean> {
    const response = await post("user/spotify/link", { authCode }, true);
    return response.status === 200;
}

export function useAuth() {
    return {
        login,
        register,
        isLoggedIn,
        linkSpotify,
        isLinkedSpotify,
    };
}
