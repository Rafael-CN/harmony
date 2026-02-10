import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { color } from "../../theme.json";
import React, { useEffect, useState } from "react";
import { HomeHeader, MusicCard, StatusBox } from "../../components/home";
import { useMusicApi } from "../../api/music";
import { Music } from "../../types";
import { useDiscoveryApi } from "../../api";
import { MusicRow, SkeletonLoader } from "../../components/common";
import { useProfile } from "../../context/ProfileContext";

export default function Home() {
    const musicApi = useMusicApi();
    const discoveryApi = useDiscoveryApi();

    const [likedMusics, setLikedMusics] = useState<Array<Music>>([]);
    const [recommendedMusics, setRecommendedMusics] = useState<Array<Music>>([]);

    const { profile } = useProfile();

    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        const [likedMusics, recommendedMusics] = await Promise.all([
            musicApi.getLikedSongs(5),
            discoveryApi.getRecommendedMusics(),
        ]);

        setLikedMusics(likedMusics.slice(0, 2));
        setRecommendedMusics(recommendedMusics);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
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
                    <StatusBox
                        title="Seguidores"
                        icon="people-outline"
                        color="#4F518C"
                        number={profile?.followersCount || 0}
                    />
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Curtidas recentes</Text>
                    {/* <TouchableOpacity>
                        <Text style={styles.sectionLink}>Ver todas</Text>
                    </TouchableOpacity> */}
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

                    {isLoading ? (
                        <ScrollView
                            contentContainerStyle={{
                                flexDirection: "row",
                                gap: 15,
                                paddingRight: 20,
                            }}
                            horizontal
                            fadingEdgeLength={50}
                        >
                            {[...Array(3)].map((_, i) => (
                                <SkeletonLoader
                                    key={i}
                                    style={{ width: 135, height: 180, borderRadius: 10 }}
                                />
                            ))}
                        </ScrollView>
                    ) : recommendedMusics && recommendedMusics.length > 0 ? (
                        <FlatList
                            data={recommendedMusics}
                            renderItem={({ item }) => <MusicCard music={item} />}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            fadingEdgeLength={50}
                            contentContainerStyle={{ gap: 15, paddingRight: 20 }}
                        />
                    ) : (
                        <Text style={styles.emptyStateText}>
                            Ouça mais músicas para ver suas recomendações aqui!
                        </Text>
                    )}
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
                    data={isLoading ? [...Array(2)] : likedMusics}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: 20 }}>
                            {isLoading ? (
                                <SkeletonLoader
                                    style={{
                                        width: "100%",
                                        height: 75,
                                        borderRadius: 10,
                                        marginBottom: 20,
                                    }}
                                />
                            ) : likedMusics && likedMusics.length > 0 ? (
                                <MusicRow music={item} />
                            ) : (
                                <Text style={styles.emptyStateText}>
                                    Curta mais músicas para ver aqui!
                                </Text>
                            )}
                        </View>
                    )}
                    keyExtractor={(item, i) => item?.id || i.toString()}
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

    loadingCard: {
        width: 50,
        height: 100,
        marginBottom: 20,
    },

    emptyStateText: {
        color: color.light,
        fontFamily: "Nexa-Regular",
        textAlign: "center",
    },
});
