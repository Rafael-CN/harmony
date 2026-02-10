import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";

interface ToastProps {
    message: string;
    type: "success" | "error";
    visible: boolean;
    onHide: () => void;
}

const Toast = ({ message, type, visible, onHide }: ToastProps) => {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            const timer = setTimeout(() => {
                Animated.parallel([
                    Animated.timing(translateY, {
                        toValue: -100,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start(() => onHide());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    const backgroundColor = type === "success" ? `${color.success}DD` : `${color.error}DD`;
    const iconName = type === "success" ? "checkmark-circle" : "alert-circle";

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor, transform: [{ translateY }], opacity },
            ]}
        >
            <Ionicons name={iconName} size={20} color={color.white} />
            <Text style={styles.message}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 60,
        left: "5%",
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 10,
        zIndex: 9999,
    },
    message: {
        color: color.white,
        fontFamily: "Nexa-Bold",
        fontSize: 14,
        flex: 1,
    },
});

export default Toast;
