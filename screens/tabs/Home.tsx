import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { Span } from "../../components";

const SongItem = ({ title = "", artist = "", isLiked = false }) => {
    return (
        <View style={styles.songItem}>
            <Image source={require("../../assets/song-cover.png")} style={styles.songCover} defaultSource={require("../../assets/song-cover.png")} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{title}</Text>
                <Text style={styles.songArtist}>{artist}</Text>
            </View>
            <TouchableOpacity style={styles.likeButton}>
                <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color={isLiked ? color.light : "#8888AA"} />
            </TouchableOpacity>
        </View>
    );
};

export default function Home() {
    const popularSongs = [
        { id: 1, title: "Believer", artist: "Imagine Dragons", isLiked: false },
        { id: 2, title: "Believer", artist: "Imagine Dragons", isLiked: false },
        { id: 3, title: "Believer", artist: "Imagine Dragons", isLiked: false },
    ];

    const recentlyLiked = [
        { id: 1, title: "Believer", artist: "Imagine Dragons", isLiked: true },
        { id: 2, title: "Believer", artist: "Imagine Dragons", isLiked: true },
        { id: 3, title: "Believer", artist: "Imagine Dragons", isLiked: true },
    ];

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
                    {popularSongs.map((song) => (
                        <SongItem key={song.id} title={song.title} artist={song.artist} isLiked={song.isLiked} />
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Últimas curtidas</Text>
                    {recentlyLiked.map((song) => (
                        <SongItem key={song.id} title={song.title} artist={song.artist} isLiked={song.isLiked} />
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
