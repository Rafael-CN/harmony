import { color } from "../../theme.json";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { Background, Span } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { getRandomMusic, Music } from "../../context/Music";
import SwipeCard from "./SwipeCard";
import { useEffect, useState } from "react";

export default function FindMusic() {
    const MusicCard = ({ ...music }: Music) => {
        return (
            <ImageBackground source={{ uri: music.photo }} style={{ flex: 1 }}>
                <LinearGradient style={style.cardBackground} colors={["#00000000", color.extraDark + "BB"]}>
                    <View style={style.music}>
                        <Image source={require("../../assets/playing.png")} style={style.equalizer} />
                    </View>
                    <View style={style.textOverlay}>
                        <View>
                            <Span color="white" bold fontSize={24} style={{ maxWidth: 450 }}>
                                {music.name}
                            </Span>
                            <Span color="white" light style={{ maxWidth: 250 }}>
                                {music.artist}
                            </Span>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        );
    };

    const [music, setMusic] = useState<Music>();

    const handleSwipe = (direction: "left" | "right", resetCard: () => void) => {
        getRandomMusic().then((music) => {
            setMusic(music);
            setTimeout(() => {
                resetCard();
            }, 50);
        });
    };

    useEffect(() => {
        getRandomMusic().then(setMusic);
    }, []);

    return (
        <Background>
            <SwipeCard onSwipe={handleSwipe}>{music && <MusicCard {...music} />}</SwipeCard>
        </Background>
    );
}

const style = StyleSheet.create({
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
