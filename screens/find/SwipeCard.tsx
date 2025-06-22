import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from "react-native";
import { color } from "../../theme.json";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export interface SwipeCardRef {
    swipe: (direction: "left" | "right") => void;
}

interface SwipeCardProps {
    onSwipeEnd: (direction: "left" | "right") => void;
    onSwiping?: (dx: number) => void;
    onSwipeCancel?: () => void;
    children: React.ReactNode;
}

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
    ({ onSwipeEnd, onSwiping, onSwipeCancel, children }, ref) => {
        const translateX = useRef(new Animated.Value(0)).current;
        const [direction, setDirection] = useState<"left" | "right">("left");

        const overlayOpacity = translateX.interpolate({
            inputRange: [-width * 0.4, 0, width * 0.4],
            outputRange: [0.75, 0, 0.75],
            extrapolate: "clamp",
        });

        const rotate = translateX.interpolate({
            inputRange: [-width / 2, 0, width / 2],
            outputRange: ["-8deg", "0deg", "8deg"],
            extrapolate: "clamp",
        });

        useEffect(() => {
            const listenerId = translateX.addListener(({ value }) => {
                onSwiping?.(value);
                setDirection(value > 0 ? "right" : "left");
            });

            return () => {
                translateX.removeListener(listenerId);
            };
        }, [translateX, onSwiping]);

        const triggerSwipe = (swipeDirection: "left" | "right") => {
            const toValue = (swipeDirection === "right" ? 1 : -1) * width;

            Animated.timing(translateX, {
                toValue,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                onSwipeEnd(swipeDirection);
            });
        };

        useImperativeHandle(ref, () => ({
            swipe: (direction: "left" | "right") => {
                triggerSwipe(direction);
            },
        }));

        const panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, { dx }) => {
                translateX.setValue(dx);
            },
            onPanResponderRelease: (_, { dx }) => {
                const swipeDirection = dx > 0 ? "right" : "left";
                const isActionActive = Math.abs(dx) > 120;

                if (isActionActive) {
                    triggerSwipe(swipeDirection);
                } else {
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        friction: 5,
                    }).start();

                    onSwipeCancel?.();
                }
            },
        });

        const animatedCardStyle = {
            transform: [{ translateX }, { rotate }],
        };

        return (
            <View style={style.container}>
                <Animated.View
                    style={[style.card, animatedCardStyle]}
                    {...panResponder.panHandlers}
                >
                    <Animated.View
                        style={[
                            style.cardOverlay,
                            {
                                opacity: overlayOpacity,
                                backgroundColor: direction === "left" ? "#4B1919" : "#183711",
                            },
                        ]}
                    >
                        <Ionicons
                            name={direction === "left" ? "heart-dislike" : "heart"}
                            style={style.swipeIcon}
                        />
                        <Text style={style.swipeText}>
                            {direction === "left" ? "Não gostei" : "Gostei"}
                        </Text>
                    </Animated.View>
                    {children}
                </Animated.View>
            </View>
        );
    }
);

const style = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    cardOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
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
    },
    swipeIcon: {
        fontSize: 120,
        color: `${color.extraLight}75`,
    },
    swipeText: {
        color: `${color.extraLight}75`,
        fontSize: 20,
        fontFamily: "Nexa-Heavy",
    },
});

export default SwipeCard;
