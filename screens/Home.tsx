import { useNavigation } from "@react-navigation/native";
import { Background, Button, Span } from "../components";

export default function Home() {
    const navigator = useNavigation();

    return (
        <Background>
            <Span>Home</Span>
            <Button onPress={navigator.goBack} text="Voltar"></Button>
        </Background>
    );
}
