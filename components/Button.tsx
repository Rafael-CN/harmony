import { Pressable, PressableProps, StyleSheet, Text } from "react-native";
import { color } from "../theme.json";

interface ButtonProps {
    text: string;
    marginBottom?: number;
    marginVertical?: number;
    marginTop?: number;
}

export default function Button({ ...props }: PressableProps & ButtonProps) {
    return (
        <Pressable {...props} style={styles.button}>
            <Text style={styles.text}>{props.text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        backgroundColor: color.light,
        width: "75%",
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },

    text: {
        fontSize: 20,
        color: color.regular,
    },
});
