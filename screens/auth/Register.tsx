import { StatusBar } from "expo-status-bar";
import { Image, Pressable } from "react-native";
import { Input, Button, Span, Background } from "../../components";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export default function Register() {
    const navigator = useNavigation();

    const goToLogin = () => {
        navigator.goBack();
    };

    const [user, setUser] = useState({ name: "", email: "", password: "" });

    const updateUser = (key: string, value: string) => {
        setUser({ ...user, [key]: value });
    };

    const handleRegister = () => {
        alert("Cadastro do usuário: " + user.name + " e email: " + user.email);
    };

    return (
        <>
            <StatusBar style="light"></StatusBar>
            <Background>
                <Image source={require("../../assets/harmony.png")} />
                <Input marginTop={25} onChangeText={(value) => updateUser("name", value)} placeholder="Nome do usuário" />
                <Input marginVertical={25} onChangeText={(value) => updateUser("email", value)} placeholder="Email" />
                <Input marginBottom={25} onChangeText={(value) => updateUser("password", value)} placeholder="Senha" />
                <Button marginBottom={15} onPress={handleRegister} text="Cadastrar" />
                <Pressable onPress={goToLogin}>
                    <Span>
                        já possui uma <Span bold>conta?</Span>
                    </Span>
                </Pressable>
            </Background>
        </>
    );
}
