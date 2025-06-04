import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet } from "react-native";
import { Input, Button, Span, Background } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuth } from "../../services/AuthService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
    const navigator = useNavigation();
    const authService = useAuth();

    const goToLogin = () => {
        navigator.goBack();
    };

    const [user, setUser] = useState({ username: "", password: "" });

    const updateUser = (key: string, value: string) => {
        setUser({ ...user, [key]: value });
    };

    const handleRegister = () => {
        authService.register(user.username, user.password).then((succeeded) => {
            if (succeeded) {
                navigator.navigate("Spotify" as never);
            } else {
                alert("Houve um erro ao cadastrar o usuário");
            }
        });
    };

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <SafeAreaView style={styles.container}>
                <Image source={require("../../assets/harmony.png")} />

                <Input marginVertical={25} onChangeText={(value) => updateUser("username", value)} placeholder="Nome do usuário" />
                <Input marginBottom={25} onChangeText={(value) => updateUser("password", value)} placeholder="Senha" />

                <Button marginBottom={15} onPress={handleRegister} text="Cadastrar" />
                <Pressable onPress={goToLogin}>
                    <Span>
                        já possui uma <Span bold>conta?</Span>
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
