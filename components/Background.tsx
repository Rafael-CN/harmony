import { ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Background({ ...props }: { children: any }) {
    return (
        <ImageBackground source={require("../assets/background.png")} style={styles.container}>
            {props.children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
});
