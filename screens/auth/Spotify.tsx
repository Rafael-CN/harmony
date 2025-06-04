import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { useAuth } from "../../services/AuthService";
import { useNavigation } from "@react-navigation/native";

export default function Spotify() {
    const redirectUri = makeRedirectUri();

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: process.env.EXPO_PUBLIC_SPOTIFY_ID,
            scopes: ["user-library-read", "user-library-modify", "user-read-email", "user-top-read"],
            redirectUri: redirectUri,
            usePKCE: false,
        },
        {
            authorizationEndpoint: "https://accounts.spotify.com/authorize",
        }
    );

    const navigator = useNavigation();
    const authService = useAuth();

    useEffect(() => {
        authService.isLinkedSpotify().then((isLinked) => {
            if (isLinked) {
                navigator.navigate("TabNavigator" as never);
            }
        });
    }, []);

    useEffect(() => {
        if (response && response.type === "success") {
            authService.linkSpotify(response.params.code).then((succeeded) => {
                if (succeeded) {
                    alert("Usuário logado com sucesso");
                    navigator.navigate("TabNavigator" as never);
                } else {
                    alert("Houve um erro ao logar com o Spotify");
                }
            });
        }
    }, [response]);

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.spotifyButton} disabled={!request} onPress={() => promptAsync()}>
                <Image source={require("../../assets/icons/spotify.png")} style={styles.spotifyImage} />
                <Text style={styles.spotifyText}>Entrar com Spotify</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1B1B28",
        alignItems: "center",
        justifyContent: "center",
    },

    spotifyButton: {
        backgroundColor: "#1DB954",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: "row",
    },

    spotifyText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    spotifyImage: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginTop: 1,
    },
});
