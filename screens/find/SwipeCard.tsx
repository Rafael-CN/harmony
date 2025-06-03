import { Animated, Dimensions, Image, ImageBackground, ImageSourcePropType, PanResponder, StyleSheet, View } from "react-native";
import { color } from "../../theme.json";
import { Span } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { Music } from "../../context/Music";

const { width, height } = Dimensions.get("window");

interface SwipeCardProps {
    onSwipe: (direction: "left" | "right", resetCard: () => void) => void;
    children: React.ReactNode;
}

export default function SwipeCard({ onSwipe, children }: SwipeCardProps) {
    const swipe = useRef(new Animated.ValueXY()).current;
    const tilt = useRef(new Animated.Value(1)).current;

    const [direction, setDirection] = useState<"left" | "right">("left");

    const overlayOpacity = swipe.x.interpolate({
        inputRange: [-width * 0.5, 0, width * 0.5],
        outputRange: [0.75, 0, 0.75],
    });

    const resetCard = () => {
        swipe.setValue({ x: 0, y: 0 });
    };

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx, dy, y0 }) => {
            swipe.setValue({ x: dx, y: dy });
            tilt.setValue(y0 > (height * 0.9) / 2 ? 1 : -1);

            if (dx > 0) {
                setDirection("right");
            } else {
                setDirection("left");
            }
        },
        onPanResponderRelease: (_, { dx, dy }) => {
            const direction = Math.sign(dx);
            const isActionActive = Math.abs(dx) > 100; // width * 0.3;

            if (isActionActive) {
                Animated.timing(swipe, {
                    toValue: {
                        x: direction * 500,
                        y: dy,
                    },
                    duration: 100,
                    useNativeDriver: true,
                }).start(() => {
                    onSwipe(dx > 0 ? "right" : "left", resetCard);
                });
            } else {
                Animated.spring(swipe, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    friction: 5,
                }).start();
            }
        },
    });

    const rotate = Animated.multiply(swipe.x, tilt).interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ["-8deg", "0deg", "8deg"],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }],
    };

    return (
        <View style={style.container}>
            {[3, 2, 1].map((e, i) => (
                <Animated.View style={[style.card, { position: "absolute", top: height * 0.15 - 15 * i, width: width * (0.75 - 0.05 * i), zIndex: e }]} key={i}></Animated.View>
            ))}

            <Animated.View style={[style.card, animatedCardStyle]} {...panResponder.panHandlers}>
                <Animated.View style={[style.cardOverlay, { opacity: overlayOpacity, backgroundColor: direction === "left" ? "#4B1919" : "#183711" }]}>
                    <Image style={{ height: 150, resizeMode: "contain" }} source={direction === "left" ? require("../../assets/icons/times.png") : require("../../assets/icons/heart.png")}></Image>
                </Animated.View>

                {children}
            </Animated.View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },

    cardBefore: {
        backgroundColor: color.regular,
        borderTopEndRadius: 15,
        borderTopStartRadius: 15,
        elevation: 20,
        boxShadow: "0px 0px 15px 1px " + color.extraDark,
    },

    cardOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#ff0000",
        zIndex: 5,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    card: {
        backgroundColor: color.regular,
        overflow: "hidden",
        width: "80%",
        height: "65%",
        borderRadius: 20,
        elevation: 10,
        zIndex: 10,
    },

    cardBackground: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },

    music: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.extraDark,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 15,
    },

    musicInfo: {
        gap: 2,
        maxWidth: 150,
    },

    musicAlbum: {
        height: 40,
        width: 40,
        borderRadius: 5,
    },

    equalizer: {
        height: 12,
        width: 20,
    },

    textOverlay: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    profileInfo: {},
    ageInfo: {
        marginTop: 10,
    },
});
