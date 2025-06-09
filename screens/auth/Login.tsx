import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";

export default function Login() {
    const navigator = useNavigation();
    const authService = useAuth();

    const [disabled, setDisabled] = useState(false);
    const [isInvalid, setInvalid] = useState(false);

    const [user, setUser] = useState({ name: "", password: "" });

    const goToRegister = () => {
        navigator.navigate("Register" as never);
    };

    const handleLogin = async () => {
        setInvalid(false);
        setDisabled(true);

        const response = await authService.login(user.name, user.password);
        if (response.succeeded) {
            AsyncStorage.setItem("token", response.token);
            navigator.navigate("Spotify" as never);
        } else {
            setInvalid(true);
        }
        setDisabled(false);
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
            <LinearGradient colors={["#000000", "#1B1B28"]} style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>harmony.</Text>
                        <Text style={styles.legend}>Onde você se sintoniza com todos!</Text>
                    </View>
                    <TextInput style={styles.input} placeholder="Nome do usuário" placeholderTextColor={color.light} onChangeText={(value) => setUser({ ...user, name: value })}></TextInput>
                    <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={color.light} onChangeText={(value) => setUser({ ...user, password: value })} secureTextEntry autoCapitalize="none"></TextInput>

                    {isInvalid && <Text style={styles.error}>Usuário ou senha inválidos</Text>}

                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={disabled}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                    <Pressable style={styles.link} onPress={goToRegister}>
                        <Text style={styles.linkText}>Ainda não possui uma conta?</Text>
                        <Text style={[styles.linkText, styles.linkTextBold]}>Cadastre-se</Text>
                    </Pressable>
                </SafeAreaView>
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

    input: {
        width: "75%",
        height: "8%",
        backgroundColor: color.extraDark,
        borderRadius: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        fontFamily: "Nexa-ExtraLight",
        color: color.extraLight,
        borderWidth: 1,
        borderColor: color.light,
        marginTop: 25,
    },

    button: {
        width: "75%",
        height: "8%",
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
        color: "red",
        marginTop: 10,
        fontFamily: "Nexa-ExtraLight",
    },
});
