import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import HTextInput from "../../components/common/HTextInput";
import { HButton } from "../../components/common";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const navigator = useNavigation();
    const { register } = useAuth();

    const goToLogin = () => {
        navigator.goBack();
    };

    const [signingUp, setSigningUp] = useState(false);
    const [user, setUser] = useState({ username: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");

    const isFormValid = user.username.trim().length > 0 && user.password.length >= 6;

    const handleSignUp = async () => {
        setErrorMessage("");

        if (user.username.trim().length === 0) {
            setErrorMessage("Preencha o nome de usuário");
            return;
        }
        if (user.password.length < 6) {
            setErrorMessage("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        setSigningUp(true);

        const response = await register(user.username, user.password);
        if (response.succeeded) {
            navigator.navigate("Login" as never);
        } else {
            alert("Houve um erro ao cadastrar o usuário");
        }

        setSigningUp(false);
    };

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <LinearGradient colors={["#000000", "#1B1B28"]} style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <SafeAreaView style={styles.container}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>harmony.</Text>
                            <Text style={styles.legend}>Onde você se sintoniza com todos!</Text>
                        </View>

                        <HTextInput
                            placeholder="Nome do usuário"
                            placeholderTextColor={color.light}
                            onChangeText={(value) => setUser({ ...user, username: value })}
                        />

                        {/* <HTextInput placeholder="Email" placeholderTextColor={color.light} /> */}

                        <HTextInput
                            placeholder="Senha"
                            placeholderTextColor={color.light}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={(value) => setUser({ ...user, password: value })}
                        />

                        {errorMessage !== "" && <Text style={styles.error} accessibilityLiveRegion="polite">{errorMessage}</Text>}

                        <HButton onPress={handleSignUp} loading={signingUp} disabled={!isFormValid} text="Cadastrar" />

                        <Pressable style={styles.link} onPress={goToLogin} accessibilityRole="link">
                            <Text style={styles.linkText}>Já possui uma conta?</Text>
                            <Text style={[styles.linkText, styles.linkTextBold]}>Faça login</Text>
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
        marginBottom: 25,
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
        marginTop: 10,
    },

    button: {
        width: "75%",
        height: 60,
        backgroundColor: color.dark,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },

    buttonText: {
        color: color.light,
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
    },

    buttonDisabled: {
        opacity: 0.5,
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
