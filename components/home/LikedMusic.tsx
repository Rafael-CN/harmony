import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";
import { Music } from "../../types";
import { useState } from "react";
import SkeletonLoader from "../common/SkeletonLoader";
import { useMusic } from "../../api";
import { useAudio } from "../../context/AudioContext";

const LikedMusic = ({ music }: { music: Music }) => {
    const [isLoading, setIsLoading] = useState(true);

    const musicApi = useMusic();

    const audio = useAudio();

    const isThisTrackActive = audio.currentTrackId === music.id;
    const isThisTrackPlaying = audio.isPlaying && isThisTrackActive;
    const isThisTrackLoading = audio.isLoading && isThisTrackActive;

    const handlePress = () => {
        audio.playTrack(music);
    };

    return (
        <TouchableOpacity style={styles.songContainer} onPress={handlePress} activeOpacity={0.7}>
            <View style={styles.songInfoContainer}>
                <View style={styles.songCoverContainer}>
                    <Image
                        source={{ uri: music.smallImageUrl }}
                        style={styles.songCover}
                        cachePolicy={"memory-disk"}
                        priority={"high"}
                        onLoadEnd={() => setIsLoading(false)}
                    />

                    {isLoading && <SkeletonLoader style={styles.songCover} />}

                    <View style={styles.coverOverlay}>
                        {isThisTrackLoading ? (
                            <ActivityIndicator size="small" color={"#fff"} />
                        ) : isThisTrackPlaying ? (
                            <Image
                                source={require("../../assets/equalizer.gif")}
                                style={styles.equalizer}
                            />
                        ) : (
                            <Ionicons name="play" style={styles.playIcon}></Ionicons>
                        )}
                    </View>
                </View>

                <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>
                        {music.name}
                    </Text>
                    <Text style={styles.songArtist}>{music.artist}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.songLink}
                onPress={(e) => {
                    e.stopPropagation();
                    Linking.openURL(music.linkUrl);
                }}
            >
                <Ionicons name="open-outline" style={styles.songLinkIcon} />
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

    songInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
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
    },

    songTitle: {
        color: color.extraLight,
        fontSize: 14,
        fontFamily: "Nexa-Heavy",
        width: 200,
    },

    songArtist: {
        color: color.light,
        fontSize: 12,
        fontFamily: "Nexa-Light",
        marginTop: 5,
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

export default LikedMusic;
