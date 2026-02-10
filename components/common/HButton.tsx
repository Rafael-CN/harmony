import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { color } from "../../theme.json";

interface HButtonProps {
    text: string;
    loading?: boolean;
}

const HButton = ({ loading, ...props }: TouchableOpacityProps & HButtonProps) => {
    return (
        <TouchableOpacity
            {...props}
            disabled={props.disabled || loading}
            style={[styles.button, (props.disabled || loading) && styles.buttonDisabled, props.style]}
            accessibilityRole="button"
            accessibilityLabel={props.text}
            accessibilityState={{ disabled: props.disabled || loading }}
        >
            {loading ? (
                <ActivityIndicator size="small" color={color.light} />
            ) : (
                <Text style={styles.buttonText}>{props.text}</Text>
            )}
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
