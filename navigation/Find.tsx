import { Pressable, PressableProps, StyleSheet, View, Animated, useAnimatedValue, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";
import { useEffect, useState } from "react";
import { Span } from "../components";
import { StatusBar } from "expo-status-bar";

interface IconButtonProps {
    name: keyof typeof Ionicons.glyphMap;
    active?: boolean;
    size: number;
}

const IconButton = ({ ...props }: IconButtonProps & PressableProps) => {
    return (
        <Pressable
            style={{
                width: props.size * 2,
                height: props.size * 2,
                borderRadius: props.size * 2,
                backgroundColor: props.active ? color.light : color.dark,
                justifyContent: "center",
                alignItems: "center",
            }}
            {...props}
        >
            <Ionicons name={props.name} size={props.size} color={props.active ? color.dark : color.light}></Ionicons>
        </Pressable>
    );
};

export default function Find() {
    const buttonAnim = {
        gap: useAnimatedValue(0),
        margin: useAnimatedValue(45),
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(buttonAnim.gap, {
                toValue: 75,
                duration: 150,
                useNativeDriver: false,
            }),
            Animated.timing(buttonAnim.margin, {
                toValue: 125,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const descriptionAnim = {
        opacity: useAnimatedValue(0),
    };

    const [active, setActive] = useState({ music: false, person: false });

    const handleActive = (type: "music" | "person" | "none") => {
        setActive({ music: false, person: false, [type]: true });

        if (type !== "none") {
            Animated.timing(descriptionAnim.opacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: false,
            }).start();
        } else {
            descriptionAnim.opacity.setValue(0);
        }
    };

    return (
        <Animated.View style={style.container}>
            <Animated.View style={[style.description, { opacity: descriptionAnim.opacity }]}>
                <Span fontSize={28}>
                    Encontre novas{" "}
                    <Span fontSize={28} bold>
                        {active.music ? "músicas." : "pessoas."}
                    </Span>
                </Span>
                <Span>{active.music ? "que combinem com seu gosto musical" : "que escutam estilos parecidos com seus"}</Span>
            </Animated.View>

            <Animated.View style={[style.buttonGroup, { gap: buttonAnim.gap, marginBottom: buttonAnim.margin }]}>
                <IconButton size={30} name="musical-notes" active={active.music} onPressIn={() => handleActive("music")} onPressOut={() => handleActive("none")} />
                <IconButton size={30} name="person" active={active.person} onPressIn={() => handleActive("person")} onPressOut={() => handleActive("none")} />
            </Animated.View>
        </Animated.View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000bb",
        alignItems: "center",
    },

    description: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginTop: 75,
    },

    buttonGroup: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
    },
});
