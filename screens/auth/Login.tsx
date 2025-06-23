import { StatusBar } from "expo-status-bar";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { useAuth } from "../../api/auth";
import HTextInput from "../../components/common/HTextInput";
import { HButton } from "../../components/common";

export default function Login() {
    const navigator = useNavigation();
    const authService = useAuth();

    const [signingIn, setSigningIn] = useState(false);
    const [isInvalid, setInvalid] = useState(false);

    const [user, setUser] = useState({ name: "", password: "" });

    const goToRegister = () => {
        navigator.navigate("Register" as never);
    };

    const handleSigningIn = async () => {
        setInvalid(false);
        setSigningIn(true);

        const response = await authService.login(user.name, user.password);
        if (response.succeeded) {
            AsyncStorage.setItem("token", response.token);
            navigator.navigate("Spotify" as never);
        } else {
            setInvalid(true);
        }

        setSigningIn(false);
    };

    useEffect(() => {
        // authService.isLoggedIn().then((isLoggedIn) => {
        //     if (isLoggedIn) {
        //         navigator.navigate("Spotify" as never);
        //     }
        // });
    }, []);

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <SafeAreaView style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>harmony.</Text>
                            <Text style={styles.legend}>Onde você se sintoniza com todos!</Text>
                        </View>
                        <HTextInput
                            placeholder="Nome do usuário"
                            placeholderTextColor={color.light}
                            onChangeText={(value) => setUser({ ...user, name: value })}
                        />
                        <HTextInput
                            placeholder="Senha"
                            placeholderTextColor={color.light}
                            onChangeText={(value) => setUser({ ...user, password: value })}
                            autoCapitalize="none"
                            secureTextEntry
                        />

                        {isInvalid && <Text style={styles.error}>Usuário ou senha inválidos</Text>}

                        <HButton onPress={handleSigningIn} disabled={signingIn} text="Entrar" />

                        <Pressable style={styles.link} onPress={goToRegister}>
                            <Text style={styles.linkText}>Ainda não possui uma conta?</Text>
                            <Text style={[styles.linkText, styles.linkTextBold]}>Cadastre-se</Text>
                        </Pressable>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </>
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
        width: "70%",
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
        marginTop: 5,
    },

    link: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    linkText: {
        color: color.light,
        fontSize: 14,
        fontFamily: "Nexa-ExtraLight",
        marginLeft: 5,
    },

    linkTextBold: {
        fontFamily: "Nexa-Heavy",
        textDecorationLine: "underline",
    },

    error: {
        color: "#E55381",
        marginTop: 10,
        fontFamily: "Nexa-ExtraLight",
    },
});
