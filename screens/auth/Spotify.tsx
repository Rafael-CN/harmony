import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { makeRedirectUri, ResponseType, useAuthRequest } from "expo-auth-session";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../../context/AuthContext";
import { color } from "../../theme.json";
import { Toast } from "../../components/common";

export default function Spotify() {
    const redirectUri = makeRedirectUri();

    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            usePKCE: false,
            clientId: process.env.EXPO_PUBLIC_SPOTIFY_ID,
            scopes: [
                "user-library-read",
                "user-read-email",
                "user-top-read",
                "playlist-read-private",
            ],
            redirectUri: redirectUri,
        },
        {
            authorizationEndpoint: "https://accounts.spotify.com/authorize",
        },
    );

    const [disabled, setDisabled] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { linkSpotify } = useAuth();

    useEffect(() => {
        if (response && response.type === "success") {
            setDisabled(true);

            linkSpotify(response.params.code).then((succeeded) => {
                if (!succeeded) {
                    setToastMessage("Houve um erro ao logar com o Spotify");
                    setToastVisible(true);
                }

                setDisabled(false);
            });
        }
    }, [response]);

    return (
        <LinearGradient colors={["#000000", "#0a401f"]} style={{ flex: 1 }}>
            <Toast
                type="error"
                message={toastMessage}
                visible={toastVisible}
                onHide={() => setToastVisible(false)}
            />
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>harmony.</Text>
                    <Text style={styles.legend}>
                        Utilizamos Spotify para sincronizar suas músicas favoritas!
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.spotifyButton, disabled && { opacity: 0.5 }]}
                    disabled={!request || disabled}
                    onPress={() => promptAsync()}
                >
                    {disabled ? (
                        <ActivityIndicator size="small" color={color.white} />
                    ) : (
                        <>
                            <Image
                                source={require("../../assets/icons/spotify.png")}
                                style={styles.spotifyImage}
                            />
                            <Text style={styles.spotifyText}>Entrar com Spotify</Text>
                        </>
                    )}
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
        color: color.white,
        fontSize: 50,
        fontFamily: "Nexa-Heavy",
    },

    legend: {
        color: color.white,
        textAlign: "center",
        fontSize: 18,
        fontFamily: "Nexa-ExtraLight",
        marginTop: 10,
    },

    spotifyButton: {
        width: "75%",
        height: "8%",
        backgroundColor: color.spotify,
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    spotifyText: {
        color: color.white,
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
