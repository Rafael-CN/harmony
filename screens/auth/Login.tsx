import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Input, Button, Span, Background } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
    const navigator = useNavigation();
    const authService = useAuth();

    const [user, setUser] = useState({ name: "", password: "" });

    const goToRegister = () => {
        navigator.navigate("Register" as never);
    };

    const handleLogin = () => {
        authService.login(user.name, user.password).then((response) => {
            if (response.succeeded) {
                AsyncStorage.setItem("token", response.token);
                navigator.navigate("Spotify" as never);
            } else {
                alert("Usuário ou senha inválidos");
            }
        });
    };

    useEffect(() => {
        authService.isLoggedIn().then((isLoggedIn) => {
            if (isLoggedIn) {
                navigator.navigate("Spotify" as never);
            }
        });
    }, []);

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <SafeAreaView style={styles.container}>
                <Image source={require("../../assets/harmony.png")}></Image>
                <Input
                    marginVertical={25}
                    onChangeText={(value) => {
                        setUser({ ...user, name: value });
                    }}
                    placeholder="Nome do usuário"
                ></Input>
                <Input
                    marginBottom={25}
                    onChangeText={(value) => {
                        setUser({ ...user, password: value });
                    }}
                    placeholder="Senha"
                ></Input>

                <Button onPress={handleLogin} marginBottom={15} text="Entrar" />

                <Pressable onPress={goToRegister}>
                    <Span>
                        não possui uma <Span bold>conta?</Span>
                    </Span>
                </Pressable>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1B1B28",
        alignItems: "center",
        justifyContent: "center",
    },
});
