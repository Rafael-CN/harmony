import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { color } from "../../theme.json";

interface HButtonProps {
    text: string;
}

const HButton = ({ ...props }: TouchableOpacityProps & HButtonProps) => {
    return (
        <TouchableOpacity
            {...props}
            style={[styles.button, props.disabled && styles.buttonDisabled, props.style]}
        >
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: "75%",
        height: 60,
        backgroundColor: color.dark,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },

    buttonText: {
        color: color.light,
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
    },

    buttonDisabled: {
        opacity: 0.5,
    },
});

export default HButton;
