import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";

export default function Register() {
    const navigator = useNavigation();
    const authService = useAuth();

    const goToLogin = () => {
        navigator.goBack();
    };

    const [disabled, setDisabled] = useState(false);
    const [user, setUser] = useState({ username: "", password: "" });

    const handleRegister = async () => {
        setDisabled(true);

        const response = await authService.register(user.username, user.password);
        if (response.succeeded) {
            navigator.navigate("Login" as never);
        } else {
            console.log(response.errors);
            alert("Houve um erro ao cadastrar o usuário");
        }

        setDisabled(false);
    };

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <LinearGradient colors={["#000000", "#1B1B28"]} style={{ flex: 1 }}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>harmony.</Text>
                        <Text style={styles.legend}>Onde você se sintoniza com todos!</Text>
                    </View>

                    <TextInput style={styles.input} placeholder="Nome do usuário" placeholderTextColor={color.light} onChangeText={(value) => setUser({ ...user, username: value })}></TextInput>
                    <TextInput style={styles.input} placeholder="Email" placeholderTextColor={color.light}></TextInput>
                    <TextInput style={styles.input} placeholder="Senha" placeholderTextColor={color.light} secureTextEntry autoCapitalize="none" onChangeText={(value) => setUser({ ...user, password: value })}></TextInput>

                    <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={disabled}>
                        <Text style={styles.buttonText}>Cadastrar</Text>
                    </TouchableOpacity>

                    <Pressable style={styles.link} onPress={goToLogin}>
                        <Text style={styles.linkText}>Já possui uma conta?</Text>
                        <Text style={[styles.linkText, styles.linkTextBold]}>Faça login</Text>
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
        marginBottom: 25,
    },

    button: {
        width: "75%",
        height: "8%",
        backgroundColor: color.dark,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
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
});
