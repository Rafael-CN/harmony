import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { color } from "../theme.json";

interface InputProps {
    marginBottom?: number;
    marginTop?: number;
    marginVertical?: number;
}

export default function Input({ ...props }: TextInputProps & InputProps) {
    return <TextInput {...props} style={[props.style, styles.input]} placeholderTextColor={color.light}></TextInput>;
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: color.light,
        color: color.light,
        fontSize: 20,
        fontWeight: "300",
        paddingHorizontal: 20,
        width: "75%",
        height: 70,
    },
});
