import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";
import { Music } from "../../types";
import { ReactNode, useState } from "react";
import { useAudio } from "../../context/AudioContext";
import SkeletonLoader from "./SkeletonLoader";

interface MusicRowProps {
    music: Music;
    linkButtonIcon?: keyof typeof Ionicons.glyphMap;
    linkButtonPress?: () => void;
}

const MusicRow = ({ music, linkButtonIcon, linkButtonPress }: MusicRowProps) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const audio = useAudio();

    const isThisTrackActive = audio.currentTrackId === music.id;
    const isThisTrackPlaying = audio.isPlaying && isThisTrackActive;
    const isThisTrackLoading = audio.isLoading && isThisTrackActive;

    const handlePress = () => {
        audio.playTrack(music.id);
    };

    const handleLinkPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        Linking.openURL(music.linkUrl);
    };

    return (
        <TouchableOpacity
            style={[styles.songContainer, isThisTrackPlaying && styles.songContainerActive]}
            onPress={handlePress}
            activeOpacity={0.7}
            disabled={isThisTrackLoading}
            accessibilityLabel={`Tocar ${music.name} de ${music.artist}`}
        >
            <View style={styles.songInfoContainer}>
                <View style={styles.songCoverContainer}>
                    <Image
                        source={{ uri: music.smallImageUrl }}
                        style={styles.songCover}
                        cachePolicy={"memory-disk"}
                        priority={"high"}
                        onLoadEnd={() => setIsImageLoading(false)}
                    />

                    {isImageLoading && <SkeletonLoader style={styles.songCover} />}

                    <View
                        style={[
                            styles.coverOverlay,
                            (isThisTrackPlaying || isThisTrackLoading) && styles.coverOverlayActive,
                        ]}
                    >
                        {isThisTrackLoading ? (
                            <ActivityIndicator size="small" color={color.white} />
                        ) : isThisTrackPlaying ? (
                            <Image
                                source={require("../../assets/equalizer.gif")}
                                style={styles.equalizer}
                            />
                        ) : (
                            <Ionicons name="play" style={styles.playIcon} />
                        )}
                    </View>
                </View>

                <View style={styles.songInfo}>
                    <Text
                        style={[styles.songTitle, isThisTrackPlaying && styles.songTitleActive]}
                        numberOfLines={1}
                    >
                        {music.name}
                    </Text>
                    <Text
                        style={[styles.songArtist, isThisTrackPlaying && styles.songArtistActive]}
                    >
                        {music.artist}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.songLink}
                onPress={linkButtonPress || handleLinkPress}
                disabled={isThisTrackLoading}
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                accessibilityLabel="Abrir no Spotify"
            >
                <Ionicons name={linkButtonIcon || "open-outline"} style={styles.songLinkIcon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    songContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: color.extraDark,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: color.dark,
    },

    songContainerActive: {
        borderColor: color.regular,
        backgroundColor: `${color.regular}10`,
    },

    songInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    songCoverContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        overflow: "hidden",
    },

    songCover: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },

    coverOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    coverOverlayActive: {
        backgroundColor: "rgba(0,0,0,0.6)",
    },

    playIcon: {
        fontSize: 22,
        color: "rgba(255,255,255,0.8)",
    },

    equalizer: {
        width: 24,
        height: 24,
    },

    songInfo: {
        marginLeft: 10,
        flex: 1,
    },

    songTitle: {
        color: color.extraLight,
        fontSize: 14,
        fontFamily: "Nexa-Heavy",
        maxWidth: "85%",
    },

    songTitleActive: {
        color: color.regular,
    },

    songArtist: {
        color: color.light,
        fontSize: 12,
        fontFamily: "Nexa-Light",
        marginTop: 5,
    },

    songArtistActive: {
        color: color.regular,
    },

    songLink: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: color.extraDark,
        borderWidth: 1,
        borderColor: color.regular,
    },

    songLinkIcon: {
        fontSize: 20,
        color: color.regular,
    },
});

export default MusicRow;
