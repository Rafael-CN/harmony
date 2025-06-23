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
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { useAuth } from "../../api/auth";
import HTextInput from "../../components/common/HTextInput";
import { HButton } from "../../components/common";

export default function Register() {
    const navigator = useNavigation();
    const authService = useAuth();

    const goToLogin = () => {
        navigator.goBack();
    };

    const [signingUp, setSigningUp] = useState(false);
    const [user, setUser] = useState({ username: "", password: "" });

    const handleSignUp = async () => {
        setSigningUp(true);

        const response = await authService.register(user.username, user.password);
        if (response.succeeded) {
            navigator.navigate("Login" as never);
        } else {
            console.log(response.errors);
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

                        <HTextInput placeholder="Email" placeholderTextColor={color.light} />

                        <HTextInput
                            placeholder="Senha"
                            placeholderTextColor={color.light}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={(value) => setUser({ ...user, password: value })}
                        />

                        <HButton onPress={handleSignUp} disabled={signingUp} text="Cadastrar" />

                        <Pressable style={styles.link} onPress={goToLogin}>
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
});
