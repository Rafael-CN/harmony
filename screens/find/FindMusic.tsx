import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import SwipeCard from "./SwipeCard";
import { useMusic } from "../../api/music";
import { Music } from "../../types";
import { useDiscovery } from "../../api";
import { Image } from "expo-image";
import SkeletonLoader from "../../components/common/SkeletonLoader";

const MusicCard = ({ ...music }: Music) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <View style={style.card}>
            <Image
                source={{ uri: music.largeImageUrl }}
                style={[StyleSheet.absoluteFillObject, { borderRadius: 20 }]}
                priority={"high"}
                cachePolicy={"memory-disk"}
                onLoadEnd={() => setIsLoading(false)}
            ></Image>

            {isLoading && <SkeletonLoader style={StyleSheet.absoluteFillObject} />}

            <LinearGradient
                style={style.cardBackground}
                colors={["transparent", color.extraDark + "BB"]}
            >
                <View style={style.music}>
                    <Image source={require("../../assets/playing.png")} style={style.equalizer} />
                </View>
                <View style={style.textOverlay}>
                    <View>
                        <Text
                            style={{
                                color: color.extraLight,
                                fontFamily: "Nexa-Heavy",
                                fontSize: 24,
                                maxWidth: 450,
                            }}
                        >
                            {music.name}
                        </Text>
                        <Text
                            style={{
                                color: color.extraLight,
                                fontFamily: "Nexa-Light",
                                maxWidth: 250,
                            }}
                        >
                            {music.artist}
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    );
};

export default function FindMusic() {
    const [musicQueue, setMusicQueue] = useState<Music[]>([]);
    const discoveryApi = useDiscovery();

    const fetchMoreMusic = async () => {
        const newSongs = await discoveryApi.getRecommendedMusics();
        setMusicQueue((prev) => [...prev, ...newSongs]);
    };

    useEffect(() => {
        fetchMoreMusic();
    }, []);

    const handleSwipe = (direction: "left" | "right", resetCard: () => void) => {
        setMusicQueue((prev) => prev.slice(1));

        if (musicQueue.length <= 3) {
            fetchMoreMusic();
        }

        setTimeout(resetCard, 50);
    };

    const currentMusic = musicQueue[0];

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
            <SwipeCard onSwipe={handleSwipe}>
                {currentMusic && <MusicCard {...currentMusic} />}
            </SwipeCard>
        </LinearGradient>
    );
}

const style = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 20,
        overflow: "hidden",
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
        paddingHorizontal: 12,
        paddingVertical: 12,
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
        width: 30,
        height: 20,
        resizeMode: "contain",
    },

    textOverlay: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },

    ageInfo: {
        marginTop: 10,
    },
});
