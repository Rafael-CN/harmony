import api from "./api";

export interface AuthResponse {
    token: string;
    succeeded: boolean;
    errors?: string[];
}
async function login(username: string, password: string): Promise<AuthResponse> {
    try {
        const response = await api.post("user/login", { username, password });

        return {
            token: response.data.token,
            succeeded: response.status === 200,
        };
    } catch (error: any) {
        return {
            token: "",
            succeeded: false,
            errors: [error.response?.data?.message || "Erro ao fazer login"],
        };
    }
}

async function register(username: string, password: string): Promise<any> {
    try {
        const response = await api.post("user/register", { username, password });

        return {
            errors: response.data.errors,
            succeeded: response.status === 200,
        };
    } catch (error: any) {
        return {
            errors: error.response?.data?.errors || ["Erro ao registrar"],
            succeeded: false,
        };
    }
}

async function isLoggedIn(): Promise<boolean> {
    try {
        const response = await api.get("user/logged-in");
        return response.data.isLoggedIn;
    } catch {
        return false;
    }
}

async function isLinkedSpotify(): Promise<boolean> {
    try {
        const response = await api.get("user/spotify/isLinked");
        return response.data.isLinked;
    } catch {
        return false;
    }
}

async function linkSpotify(authCode: string): Promise<boolean> {
    try {
        const response = await api.post("user/spotify/link", { authCode });
        return response.status === 200;
    } catch {
        return false;
    }
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
