import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import HTextInput from "../../components/common/HTextInput";
import { HButton } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigator = useNavigation();
    const { login } = useAuth();

    const [signingIn, setSigningIn] = useState(false);
    const [isInvalid, setInvalid] = useState(false);

    const [user, setUser] = useState({ name: "", password: "" });

    const goToRegister = () => {
        navigator.navigate("Register" as never);
    };

    const isFormValid = user.name.trim().length > 0 && user.password.trim().length > 0;

    const handleSigningIn = async () => {
        if (!isFormValid) return;

        setInvalid(false);
        setSigningIn(true);

        const response = await login(user.name, user.password);
        if (!response.succeeded) {
            setInvalid(true);
        }

        setSigningIn(false);
    };

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

                        {isInvalid && <Text style={styles.error} accessibilityLiveRegion="polite">Usuário ou senha inválidos</Text>}

                        <HButton onPress={handleSigningIn} loading={signingIn} disabled={!isFormValid} text="Entrar" />

                        <Pressable style={styles.link} onPress={goToRegister} accessibilityRole="link">
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
        color: color.white,
        fontSize: 50,
        fontFamily: "Nexa-Heavy",
    },

    legend: {
        color: color.white,
        textAlign: "center",
        fontSize: 18,
        fontFamily: "Nexa-ExtraLight",
        marginTop: 5,
    },

    link: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
        paddingVertical: 12,
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
        color: color.error,
        marginTop: 10,
        fontFamily: "Nexa-ExtraLight",
    },
});
