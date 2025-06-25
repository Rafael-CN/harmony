import api from "./api";

export interface AuthResponse {
    token: string;
    succeeded: boolean;
}
async function login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post("user/login", { username, password });

    return {
        token: response?.data.token,
        succeeded: response?.status == 200,
    };
}

async function register(username: string, password: string): Promise<any> {
    const response = await api.post("user/register", { username, password });

    return {
        errors: response?.data.errors,
        succeeded: response?.status == 200,
    };
}

async function isLoggedIn(): Promise<boolean> {
    const response = await api.get("user/logged-in");
    return response?.data.isLoggedIn;
}

async function isLinkedSpotify(): Promise<boolean> {
    const response = await api.get("user/spotify/isLinked");
    console.log(response);

    return response?.data.isLinked;
}

async function linkSpotify(authCode: string): Promise<boolean> {
    const response = await api.post("user/spotify/link", { authCode });
    return response?.status === 200;
}

export function useAuthApi() {
    return {
        login,
        register,
        isLoggedIn,
        linkSpotify,
        isLinkedSpotify,
    };
}
