import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthService";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function Spotify() {
    const redirectUri = makeRedirectUri();

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: process.env.EXPO_PUBLIC_SPOTIFY_ID,
            scopes: ["user-library-read", "user-library-modify", "user-read-email", "user-top-read", "playlist-read-private", "playlist-modify-public", "playlist-modify-private"],
            redirectUri: redirectUri,
            usePKCE: false,
        },
        {
            authorizationEndpoint: "https://accounts.spotify.com/authorize",
        }
    );

    const [disabled, setDisabled] = useState(false);

    const navigator = useNavigation();
    const authService = useAuth();

    useEffect(() => {
        setDisabled(true);

        authService.isLinkedSpotify().then((isLinked) => {
            if (isLinked) {
                navigator.navigate("TabNavigator" as never);
            }

            setDisabled(false);
        });
    }, []);

    useEffect(() => {
        if (response && response.type === "success") {
            setDisabled(true);

            authService.linkSpotify(response.params.code).then((succeeded) => {
                if (succeeded) {
                    navigator.navigate("TabNavigator" as never);
                } else {
                    alert("Houve um erro ao logar com o Spotify");
                }

                setDisabled(false);
            });
        }
    }, [response]);

    return (
        <LinearGradient colors={["#000000", "#0a401f"]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>harmony.</Text>
                    <Text style={styles.legend}>Utilizamos Spotify para sincronizar suas músicas favoritas!</Text>
                </View>

                <TouchableOpacity style={styles.spotifyButton} disabled={!request || disabled} onPress={() => promptAsync()}>
                    <Image source={require("../../assets/icons/spotify.png")} style={styles.spotifyImage} />
                    <Text style={styles.spotifyText}>Entrar com Spotify</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    titleContainer: {
        alignItems: "center",
        width: "80%",
        marginBottom: 30,
    },

    title: {
        color: "#fff",
        fontSize: 50,
        fontFamily: "Nexa-Heavy",
    },

    legend: {
        color: "#fff",
        textAlign: "center",
        fontSize: 18,
        fontFamily: "Nexa-ExtraLight",
        marginTop: 10,
    },

    spotifyButton: {
        width: "75%",
        height: "8%",
        backgroundColor: "#1DB954",
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    spotifyText: {
        color: "white",
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
    },

    spotifyImage: {
        width: 25,
        height: 25,
        marginRight: 15,
        marginTop: 1,
    },
});
