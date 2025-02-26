import { StatusBar } from "expo-status-bar";
import { Image, ImageBackground, Pressable, StyleSheet } from "react-native";
import { Input, Button, Span } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function Login() {
    const navigator = useNavigation();

    const goToRegister = () => {
        navigator.navigate("Register" as never);
    };

    const [user, setUser] = useState({ name: "", password: "" });

    const handleLogin = () => {
        alert("Login do usuário: " + user.name + " e senha: " + user.password);
    };

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <ImageBackground source={require("../../assets/background.png")} style={styles.container}>
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
            </ImageBackground>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
