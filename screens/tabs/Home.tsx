import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { getRandomMusicList } from "../../context/Music";
import { Span } from "../../components";
import { Music, useMusic } from "../../services/MusicService";

const SongItem = (music: Music) => {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.songItem}>
            <Image source={{ uri: music.imageUrl }} style={styles.songCover} defaultSource={require("../../assets/song-cover.png")} />
            <View style={styles.songInfo}>
                <Span style={styles.songTitle}>{music.name}</Span>
                <Span style={styles.songArtist}>{music.artist}</Span>
            </View>
            <TouchableOpacity style={styles.likeButton} onPress={() => setLiked(!liked)}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? color.light : color.regular} />
            </TouchableOpacity>
        </View>
    );
};

export default function Home() {
    const musicService = useMusic();

    let [randomSongs, setRandomSongs] = useState<Array<Music>>([]);
    let [likedSongs, setLikedSongs] = useState<Array<Music>>([]);

    useEffect(() => {
        musicService.getLikedSongs().then((songs) => {
            setLikedSongs(songs);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem vindo,</Text>
                <Text style={styles.userName}>Rafael.</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mais populares de hoje</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimas curtidas</Text>
                    {likedSongs.map((music, i) => (
                        <SongItem key={i} {...music} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.extraDark,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
    },
    welcomeText: {
        color: color.light,
        fontSize: 24,
        fontFamily: "Nexa-ExtraLight",
    },
    userName: {
        color: color.light,
        fontSize: 40,
        fontFamily: "Nexa-Heavy",
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: color.light,
        fontSize: 24,
        marginBottom: 15,
        paddingHorizontal: 20,
        fontFamily: "Nexa-Heavy",
    },
    songItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    songCover: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    songInfo: {
        flex: 1,
        marginLeft: 15,
    },
    songTitle: {
        color: color.extraLight,
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
    },
    songArtist: {
        color: color.light,
        fontSize: 14,
        fontFamily: "Nexa-ExtraLight",
    },
    likeButton: {
        padding: 10,
    },
});
