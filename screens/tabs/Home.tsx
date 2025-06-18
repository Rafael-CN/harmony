import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { color } from "../../theme.json";
import React, { useEffect, useState } from "react";
import { Music, useMusic } from "../../services/MusicService";
import { ProfileData, useUser } from "../../services/UserService";
import { HomeHeader, LikedMusic, RecommendMusic, StatusBox } from "../../components/home";
import { Image } from "expo-image";

export default function Home() {
    const musicService = useMusic();

    const [likedSongs, setLikedSongs] = useState<Array<Music>>([]);
    const [reccomendedSongs, setRecommendedSongs] = useState<Array<Music>>([]);

    const userService = useUser();

    const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
        musicService.getLikedSongs(5).then((songs) => {
            setLikedSongs(songs.slice(0, 2));

            musicService.getRecommendedSongs(songs.map((s) => s.id)).then(setRecommendedSongs);
        });

        userService.getProfile().then(setProfile);
    }, []);

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={styles.container}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style="light" />

                <HomeHeader profile={profile} />

                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 20 }} fadingEdgeLength={50}>
                    <View style={styles.statusGroup}>
                        <StatusBox title="Músicas curtidas" icon="heart-outline" color="#D6677F" number={profile?.status.likedCount || 0} />
                        <StatusBox title="Amigos" icon="people-outline" color="#4F518C" number={0} />
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Curtidas recentes</Text>
                            <TouchableOpacity>
                                <Text style={styles.sectionLink}>Ver todas</Text>
                            </TouchableOpacity>
                        </View>

                        {likedSongs && likedSongs.map((music, i) => <LikedMusic music={music} key={music.name} />)}
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Músicas recomendadas</Text>
                        </View>

                        <ScrollView contentContainerStyle={{ flexDirection: "row", gap: 15, paddingRight: 20 }} horizontal showsHorizontalScrollIndicator={false} fadingEdgeLength={50}>
                            {reccomendedSongs && reccomendedSongs.map((music, i) => <RecommendMusic key={music.name} music={music} />)}
                        </ScrollView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    section: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },

    sectionHeader: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    sectionTitle: {
        color: color.extraLight,
        fontFamily: "Nexa-Heavy",
        fontSize: 18,
    },

    sectionLink: {
        color: color.light,
        fontFamily: "Nexa-Regular",
    },

    statusGroup: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
});
