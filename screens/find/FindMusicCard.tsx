import { useState } from "react";
import { Music } from "../../types";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { SkeletonLoader } from "../../components/common";
import { color } from "../../theme.json";

const FindMusicCard = ({ music }: { music: Music }) => {
    const [imageIsLoading, setImageIsLoading] = useState(true);

    return (
        <View style={styles.musicCard}>
            <View style={styles.musicCoverContainer}>
                <Image
                    source={{ uri: music.largeImageUrl }}
                    style={styles.musicCover}
                    priority={"high"}
                    cachePolicy={"memory-disk"}
                    onLoadEnd={() => setImageIsLoading(false)}
                />

                {imageIsLoading && <SkeletonLoader style={styles.musicCover} />}
            </View>

            <View style={styles.musicInfoContainer}>
                <Text style={styles.musicTitle} numberOfLines={1}>
                    {music.name}
                </Text>
                <Text style={styles.musicArtist} numberOfLines={1}>
                    {music.artist}
                </Text>

                <View style={styles.musicInfoFooter}>
                    <Text style={styles.musicReleaseYear}>2020</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    musicCard: {
        flex: 1,
    },

    musicCoverContainer: {
        width: "100%",
        height: "80%",
    },

    musicCover: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },

    musicInfoContainer: {
        height: "20%",
        backgroundColor: color.extraDark,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    musicTitle: {
        color: color.extraLight,
        fontFamily: "Nexa-Heavy",
        fontSize: 18,
        maxWidth: "95%",
    },

    musicArtist: {
        color: `${color.extraLight}99`,
        fontFamily: "Nexa-Light",
        fontSize: 14,
    },

    musicInfoFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
    },

    musicReleaseYear: {
        color: `${color.extraLight}99`,
        fontFamily: "Nexa-Light",
        fontSize: 12,
    },
});

export default FindMusicCard;
