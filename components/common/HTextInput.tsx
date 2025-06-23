import { StyleSheet, TextInputProps } from "react-native";
import { TextInput } from "react-native";
import { color } from "../../theme.json";

const HTextInput = ({ ...props }: TextInputProps) => {
    return (
        <TextInput
            placeholderTextColor={color.light}
            {...props}
            style={[styles.input, props.style]}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: "75%",
        height: 60,
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
});

export default HTextInput;
