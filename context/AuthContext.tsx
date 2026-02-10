import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuthApi } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken, setOnUnauthorized } from "../api/api";

interface IAuthContext {
    isLoading: boolean;
    userToken: string | null;
    isLinkedSpotify: boolean;
    login: (username: string, password: string) => Promise<any>;
    logout: () => void;
    register: (username: string, password: string) => Promise<any>;
    linkSpotify: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const authApi = useAuthApi();

    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLinkedSpotify, setIsLinkedSpotify] = useState(false);

    const login = async (username: string, password: string) => {
        const response = await authApi.login(username, password);
        if (response.succeeded) {
            setAuthToken(response.token);
            setUserToken(response.token);

            const isLinked = await authApi.isLinkedSpotify();
            setIsLinkedSpotify(isLinked);

            await AsyncStorage.setItem("userToken", response.token);
        }

        return response;
    };

    const logout = async () => {
        setUserToken(null);
        setAuthToken(null);

        await AsyncStorage.removeItem("userToken");
    };

    const register = async (username: string, password: string) => {
        return await authApi.register(username, password);
    };

    const linkSpotify = async (code: string) => {
        const response = await authApi.linkSpotify(code);
        if (response) {
            setIsLinkedSpotify(true);
        }

        return response;
    };

    useEffect(() => {
        setOnUnauthorized(() => logout());

        const bootstrapAsync = async () => {
            let token;
            try {
                token = await AsyncStorage.getItem("userToken");
            } catch (e) {
                // Restaurar token falhou
            }

            if (token) {
                setUserToken(token);
                setAuthToken(token);

                const isLinked = await authApi.isLinkedSpotify();
                setIsLinkedSpotify(isLinked);
            }

            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const value = useMemo(
        () => ({
            isLoading,
            userToken,
            isLinkedSpotify,
            login,
            logout,
            register,
            linkSpotify,
        }),
        [isLoading, userToken, isLinkedSpotify]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
