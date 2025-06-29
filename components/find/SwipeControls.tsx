import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useAudio } from "../../context/AudioContext";
import { ActivityIndicator, Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";

export interface SwipeControlsRef {
    playTrack: (trackId: string) => void;
}

interface SwipeControlsProps {
    trackId: string | null;
    onDislikePress: () => void;
    onLikePress: () => void;
}

const SwipeControls = forwardRef<SwipeControlsRef, SwipeControlsProps>(
    ({ trackId, onDislikePress, onLikePress }, ref) => {
        const [disabled, setDisabled] = useState(false);

        const handleButtonPress = (onPress: () => void) => {
            setDisabled(true);
            onPress();

            setTimeout(() => {
                setDisabled(false);
            }, 250);
        };

        const audio = useAudio();

        const isThisTrackActive = audio.currentTrackId === trackId;
        const isThisTrackPlaying = audio.isPlaying && isThisTrackActive;
        const isThisTrackLoading = audio.isLoading && isThisTrackActive;

        const progress = audio.playbackPosition / audio.playbackDuration;
        const progressAnim = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            if (!isThisTrackActive) {
                progressAnim.setValue(0);
                return;
            }

            Animated.timing(progressAnim, {
                toValue: progress,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }, [isThisTrackActive, progress]);

        const progressStyle = {
            transform: [{ scaleX: progressAnim }],
        };

        useImperativeHandle(ref, () => ({
            playTrack: (trackId: string) => {
                audio.playTrack(trackId);
            },
        }));

        const handlePlay = () => {
            if (trackId === null) return;

            audio.playTrack(trackId);
        };

        return (
            <View style={styles.swipeControls}>
                <Animated.View style={[styles.progressBar, progressStyle]} />

                <TouchableOpacity
                    style={[styles.swipeButton, { paddingLeft: 30 }]}
                    onPress={() => handleButtonPress(onDislikePress)}
                    disabled={disabled}
                >
                    <Ionicons name="heart-dislike" style={styles.swipeIcon} color={"#ff5a5f"} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.playButton}
                    disabled={disabled || trackId === null}
                    onPress={handlePlay}
                >
                    {isThisTrackLoading ? (
                        <ActivityIndicator
                            size={"small"}
                            style={{ marginHorizontal: 5 }}
                            color={color.extraLight}
                        />
                    ) : isThisTrackPlaying ? (
                        <Ionicons name="pause" style={styles.playIcon} color={color.extraLight} />
                    ) : (
                        <Ionicons
                            name={trackId === null ? "ban-outline" : "play"}
                            style={styles.playIcon}
                            color={trackId === null ? `${color.extraLight}60` : color.extraLight}
                        />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.swipeButton, { paddingRight: 30 }]}
                    onPress={() => handleButtonPress(onLikePress)}
                    disabled={disabled}
                >
                    <Ionicons name="heart" style={styles.swipeIcon} color={"#52b788"} />
                </TouchableOpacity>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    swipeControls: {
        position: "absolute",
        bottom: 30,
        zIndex: 10,
        flexDirection: "row",
        gap: 20,
        backgroundColor: color.extraDark,
        borderRadius: 10,
        elevation: 10,
        overflow: "hidden",
    },

    swipeButton: {
        padding: 20,
        borderRadius: 50,
    },

    swipeIcon: {
        fontSize: 30,
    },

    playButton: {
        padding: 20,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },

    playIcon: {
        fontSize: 30,
    },

    progressBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 5,
        width: "100%",
        backgroundColor: color.regular,
        transformOrigin: "left",
    },
});

export default SwipeControls;
