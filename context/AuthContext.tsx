import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuthApi } from "../api";
import { AuthResponse, RegisterResponse } from "../api/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setAuthToken, setOnUnauthorized, setOnNetworkError } from "../api/api";
import Toast from "../components/common/Toast";

interface IAuthContext {
    isLoading: boolean;
    userToken: string | null;
    isLinkedSpotify: boolean;
    login: (username: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    register: (username: string, password: string) => Promise<RegisterResponse>;
    linkSpotify: (code: string) => Promise<boolean>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const authApi = useAuthApi();

    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [isLinkedSpotify, setIsLinkedSpotify] = useState(false);
    const [networkError, setNetworkError] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        const response = await authApi.login(username, password);
        if (response.succeeded) {
            setAuthToken(response.token);
            setUserToken(response.token);

            const isLinked = await authApi.isLinkedSpotify();
            setIsLinkedSpotify(isLinked);

            await AsyncStorage.setItem("userToken", response.token);
        }

        return response;
    }, [authApi]);

    const logout = useCallback(async () => {
        setUserToken(null);
        setAuthToken(null);

        await AsyncStorage.removeItem("userToken");
    }, []);

    const register = useCallback(async (username: string, password: string) => {
        return await authApi.register(username, password);
    }, [authApi]);

    const linkSpotify = useCallback(async (code: string) => {
        const response = await authApi.linkSpotify(code);
        if (response) {
            setIsLinkedSpotify(true);
        }

        return response;
    }, [authApi]);

    useEffect(() => {
        setOnUnauthorized(() => logout());
        setOnNetworkError(() => {
            setNetworkError(true);
        });

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
        [isLoading, userToken, isLinkedSpotify, login, logout, register, linkSpotify]
    );

    return (
        <AuthContext.Provider value={value}>
            <Toast
                type="error"
                message="Sem conexão. Verifique sua internet e tente novamente."
                visible={networkError}
                onHide={() => setNetworkError(false)}
            />
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
