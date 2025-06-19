import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { color } from "../../theme.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { ArtistListItem, GenreTag, ProfileEditModal, ProfileInfo } from "../../components/profile";
import { Artist, ProfileData } from "../../types";
import { useMusic } from "../../api";
import { useProfile } from "../../hooks/useProfile";

export default function Profile() {
    const musicService = useMusic();

    const { profile, fetchProfile } = useProfile();
    const [visible, setVisible] = useState(false);

    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);

    const handleSaveProfile = (editedData: ProfileData) => {
        fetchProfile();
        setVisible(false);
        console.log("Perfil salvo com sucesso!");
    };

    useEffect(() => {
        if (profile) {
            let tasks = profile.status.topArtists.slice(0, 3).map((artistId) => {
                return musicService.getArtist(artistId);
            });

            Promise.all(tasks).then(setTopArtists);
        }
    }, [profile]);

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={styles.container}>
            <SafeAreaView style={styles.container}>
                <ProfileEditModal
                    profile={profile}
                    visible={visible}
                    setVisible={setVisible}
                    onSave={handleSaveProfile}
                />
                <ProfileInfo profile={profile} onEdit={() => setVisible(true)} />

                <View style={styles.stats}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>{profile?.status.likedCount}</Text>
                        <Text style={styles.statsTitle}>Curtidas</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>{profile?.followersCount}</Text>
                        <Text style={styles.statsTitle}>Seguidores</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>{profile?.followingCount}</Text>
                        <Text style={styles.statsTitle}>Seguindo</Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Gêneros favoritos</Text>
                    <View style={styles.genresContainer}>
                        {profile?.status.topGenres.slice(0, 2).map((genre, i) => (
                            <GenreTag key={i} genre={genre} />
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Artistas favoritos</Text>

                    <View style={styles.artistListContainer}>
                        {topArtists.length > 0 ? (
                            topArtists.map((artist, i) => (
                                <ArtistListItem key={artist.id} artist={artist} rank={i + 1} />
                            ))
                        ) : (
                            <Text style={styles.emptyStateText}>
                                Ouça mais músicas para ver seus artistas favoritos aqui!
                            </Text>
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        width: "100%",
    },

    stats: {
        flexDirection: "row",
        marginTop: 20,
        gap: 10,
    },

    statsContainer: {
        backgroundColor: color.extraDark,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 25,
        alignItems: "center",
    },

    statsValue: {
        color: color.extraLight,
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
        marginBottom: 10,
    },

    statsTitle: {
        color: color.extraLight,
        fontSize: 12,
        fontFamily: "Nexa-Light",
    },

    sectionContainer: {
        marginTop: 20,
        width: "87%",
        alignItems: "flex-start",
        backgroundColor: color.extraDark,
        padding: 20,
        borderRadius: 10,
    },

    sectionTitle: {
        color: color.extraLight,
        fontSize: 16,
        fontFamily: "Nexa-Bold",
        marginBottom: 10,
    },

    genresContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 10,
    },

    artistListContainer: {
        marginTop: 10,
        width: "100%",
    },

    emptyStateText: {
        color: color.light,
        fontFamily: "Nexa-Light",
        fontSize: 14,
        textAlign: "center",
        opacity: 0.7,
    },
});
