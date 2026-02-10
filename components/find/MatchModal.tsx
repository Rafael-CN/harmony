import { useEffect, useRef } from "react";
import { Animated, Modal, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { HButton } from "../common";

interface MatchModalProps {
    visible: boolean;
    onClose: () => void;
    username: string;
}

const MatchModal = ({ visible, onClose, username }: MatchModalProps) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            scaleAnim.setValue(0.5);
            opacityAnim.setValue(0);

            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 80,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <BlurView
                intensity={5}
                tint="dark"
                style={styles.blurContainer}
                experimentalBlurMethod="dimezisBlurView"
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <Ionicons name="heart" size={80} color={color.error} />
                    <Text style={styles.title}>É um match!</Text>
                    <Text style={styles.subtitle}>
                        Você e @{username} se curtiram!
                    </Text>
                    <HButton
                        style={{ width: "80%", marginTop: 10 }}
                        onPress={onClose}
                        text="Continuar"
                    />
                </Animated.View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    blurContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        width: "85%",
        backgroundColor: color.extraDark,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: color.dark,
    },
    title: {
        color: color.extraLight,
        fontSize: 28,
        fontFamily: "Nexa-Heavy",
        marginTop: 15,
    },
    subtitle: {
        color: color.light,
        fontSize: 16,
        fontFamily: "Nexa-Regular",
        marginTop: 8,
    },
});

export default MatchModal;
