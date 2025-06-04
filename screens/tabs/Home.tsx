import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { color } from "../../theme.json";
import { Music, useMusic } from "../../services/MusicService";
import { useUser } from "../../services/UserService";
import SongItem from "../../components/SongItem";

export default function Home() {
    const musicService = useMusic();
    const userService = useUser();

    const [topSongs, setTopSongs] = useState<Array<Music>>([]);
    const [likedSongs, setLikedSongs] = useState<Array<Music>>([]);

    const [username, setUsername] = useState("");

    useEffect(() => {
        musicService.getTopSongs().then((songs) => {
            setTopSongs(songs);
        });

        musicService.getLikedSongs().then((songs) => {
            setLikedSongs(songs);
        });

        userService.getUsername().then((name) => {
            setUsername(name);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.header}>
                <Text style={styles.welcomeText}>Bem vindo,</Text>
                <Text style={styles.userName}>{username}.</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>As suas mais escutadas</Text>
                    {topSongs.map((music, i) => (
                        <SongItem key={i} music={music} />
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimas curtidas</Text>
                    {likedSongs.map((music, i) => (
                        <SongItem key={i} music={music} />
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
