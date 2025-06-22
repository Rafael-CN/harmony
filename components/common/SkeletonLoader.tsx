import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";

const SkeletonLoader = ({ style }: { style?: any }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={[styles.gradient, { transform: [{ translateX }] }]}>
                <LinearGradient
                    colors={[color.dark, color.regular, color.dark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFillObject}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.dark,
        overflow: "hidden",
    },
    gradient: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "100%",
    },
});

export default SkeletonLoader;
