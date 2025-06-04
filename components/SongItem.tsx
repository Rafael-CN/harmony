import { useState } from "react";
import { Music } from "../services/MusicService";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../theme.json";
import Span from "./Span";
import { Image } from "expo-image";

export default function SongItem({ music }: { music: Music }) {
    const [liked, setLiked] = useState(false);

    return (
        <View style={styles.songItem}>
            <Image source={{ uri: music.imageUrl }} style={styles.songCover} placeholder={require("../assets/song-cover.png")} />
            <View style={styles.songInfo}>
                <Span style={styles.songTitle}>{music.name}</Span>
                <Span style={styles.songArtist}>{music.artist}</Span>
            </View>
            <TouchableOpacity style={styles.likeButton} onPress={() => setLiked(!liked)}>
                <Ionicons name={liked ? "heart" : "heart-outline"} size={24} color={liked ? color.light : color.regular} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
