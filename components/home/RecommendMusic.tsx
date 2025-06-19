import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";
import { Music } from "../../types";
import { useState } from "react";
import SkeletonLoader from "../common/SkeletonLoader";

const RecommendMusic = ({ music }: { music: Music }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <TouchableOpacity
            key={music.name}
            style={styles.musicContainer}
            onPress={() => Linking.openURL(music.linkUrl)}
        >
            <View style={styles.musicCoverContainer}>
                <Image
                    source={{ uri: music.mediumImageUrl }}
                    style={styles.musicCover}
                    priority={"high"}
                    cachePolicy={"memory-disk"}
                    onLoadEnd={() => setIsLoading(false)}
                />

                {isLoading && <SkeletonLoader style={styles.musicCover} />}
            </View>

            <Text style={styles.musicName} numberOfLines={1}>
                {music.name}
            </Text>
            <Text style={styles.musicArtist} numberOfLines={1}>
                {music.artist}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    musicContainer: {
        backgroundColor: color.extraDark,
        borderWidth: 1.5,
        borderColor: color.dark,
        padding: 15,
        borderRadius: 10,
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

    musicName: {
        marginTop: 15,
        fontFamily: "Nexa-Bold",
        fontSize: 14,
        color: color.extraLight,
        maxWidth: 100,
    },
    musicArtist: {
        marginTop: 10,
        fontFamily: "Nexa-Bold",
        fontSize: 12,
        color: color.light,
        opacity: 0.7,
        maxWidth: 100,
    },
});

export default RecommendMusic;
