import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { color } from "../../theme.json";
import React, { useEffect, useState } from "react";
import { HomeHeader, MusicCard, StatusBox } from "../../components/home";
import { useMusic } from "../../api/music";
import { Music } from "../../types";
import { useProfile } from "../../hooks/useProfile";
import { useDiscovery } from "../../api";
import { MusicRow } from "../../components/common";

export default function Home() {
    const musicApi = useMusic();
    const discoveryApi = useDiscovery();

    const [likedMusics, setLikedMusics] = useState<Array<Music>>([]);
    const [recommendedMusics, setRecommendedMusics] = useState<Array<Music>>([]);

    const { profile, isLoading } = useProfile();

    useEffect(() => {
        musicApi.getLikedSongs(5).then((songs) => {
            setLikedMusics(songs.slice(0, 2));

            discoveryApi.getRecommendedMusics().then(setRecommendedMusics);
        });
    }, []);

    const renderListHeader = () => {
        return (
            <>
                <View style={styles.statusGroup}>
                    <StatusBox
                        title="Músicas curtidas"
                        icon="heart-outline"
                        color="#D6677F"
                        number={profile?.status.likedCount || 0}
                    />
                    <StatusBox title="Amigos" icon="people-outline" color="#4F518C" number={0} />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Curtidas recentes</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionLink}>Ver todas</Text>
                    </TouchableOpacity>
                </View>
            </>
        );
    };

    const renderListFooter = () => {
        return (
            <>
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, { paddingLeft: 0 }]}>
                        <Text style={styles.sectionTitle}>Músicas recomendadas</Text>
                    </View>

                    <FlatList
                        data={recommendedMusics}
                        renderItem={({ item }) => <MusicCard music={item} />}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        fadingEdgeLength={50}
                        contentContainerStyle={{ gap: 15, paddingRight: 20 }}
                    />
                </View>
            </>
        );
    };

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={styles.container}>
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style="light" />
                <HomeHeader profile={profile} />

                <FlatList
                    data={likedMusics}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20 }}>
                            <MusicRow music={item} />
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderListHeader}
                    ListFooterComponent={renderListFooter}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    fadingEdgeLength={100}
                />
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
        paddingHorizontal: 20,
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
        marginVertical: 20,
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
});
