import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";
import { Music } from "../../types";
import { useState } from "react";
import { SkeletonLoader } from "../common";
import { useAudio } from "../../context/AudioContext";

const MusicCard = ({ music }: { music: Music }) => {
    const [isImageLoading, setIsImageLoading] = useState(true);
    const audio = useAudio();

    const isThisTrackActive = audio.currentTrackId === music.id;
    const isThisTrackPlaying = audio.isPlaying && isThisTrackActive;
    const isThisTrackLoading = audio.isLoading && isThisTrackActive;

    const handlePress = () => {
        audio.playTrack(music.id);
    };

    const handleLinkPress = (e: any) => {
        e.stopPropagation();
        Linking.openURL(music.linkUrl);
    };

    return (
        <View style={[styles.musicContainer, isThisTrackPlaying && styles.musicContainerActive]}>
            <TouchableOpacity
                style={styles.musicCoverContainer}
                onPress={handlePress}
                activeOpacity={0.7}
                disabled={isThisTrackLoading}
            >
                <Image
                    source={{ uri: music.mediumImageUrl }}
                    style={styles.musicCover}
                    priority={"high"}
                    cachePolicy={"memory-disk"}
                    onLoadEnd={() => setIsImageLoading(false)}
                />

                {isImageLoading && <SkeletonLoader style={styles.musicCover} />}

                <View
                    style={[
                        styles.coverOverlay,
                        (isThisTrackPlaying || isThisTrackLoading) && styles.coverOverlayActive,
                    ]}
                >
                    {isThisTrackLoading ? (
                        <ActivityIndicator size="small" color={"#fff"} />
                    ) : isThisTrackPlaying ? (
                        <Image
                            source={require("../../assets/equalizer.gif")}
                            style={styles.equalizer}
                        />
                    ) : (
                        <Ionicons name="play" style={styles.playIcon} />
                    )}
                </View>
            </TouchableOpacity>

            <View style={styles.musicInfo}>
                <Text
                    style={[styles.musicName, isThisTrackPlaying && styles.musicNameActive]}
                    numberOfLines={1}
                >
                    {music.name}
                </Text>
                <Text
                    style={[styles.musicArtist, isThisTrackPlaying && styles.musicArtistActive]}
                    numberOfLines={1}
                >
                    {music.artist}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.linkButton}
                onPress={handleLinkPress}
                disabled={isThisTrackLoading}
            >
                <Ionicons name="open-outline" style={styles.linkIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    musicContainer: {
        backgroundColor: color.extraDark,
        borderWidth: 1.5,
        borderColor: color.dark,
        padding: 15,
        borderRadius: 10,
        position: "relative",
    },

    musicContainerActive: {
        borderColor: color.regular,
        backgroundColor: `${color.regular}10`,
    },

    musicCoverContainer: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: "hidden",
    },

    musicCover: {
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
        fontSize: 28,
        color: "rgba(255,255,255,0.8)",
    },

    equalizer: {
        width: 32,
        height: 32,
    },

    musicInfo: {
        marginTop: 15,
    },

    musicName: {
        fontFamily: "Nexa-Bold",
        fontSize: 14,
        color: color.extraLight,
        maxWidth: 100,
    },

    musicNameActive: {
        color: color.regular,
    },

    musicArtist: {
        marginTop: 10,
        fontFamily: "Nexa-Bold",
        fontSize: 12,
        color: color.light,
        opacity: 0.7,
        maxWidth: 100,
    },

    musicArtistActive: {
        color: color.regular,
        opacity: 1,
    },

    linkButton: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(0,0,0,0.7)",
        borderWidth: 1,
        borderColor: color.regular,
        justifyContent: "center",
        alignItems: "center",
    },

    linkIcon: {
        fontSize: 14,
        color: color.regular,
    },
});

export default MusicCard;
