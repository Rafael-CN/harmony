import { LinearGradient } from "expo-linear-gradient";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import { color } from "../../theme.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { ArtistListItem, GenreTag, ProfileEditModal, ProfileInfo } from "../../components/profile";
import { Artist } from "../../types";
import { useMusicApi } from "../../api";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { HButton } from "../../components/common";

export default function Profile() {
    const musicService = useMusicApi();
    const { logout } = useAuth();

    const { profile, fetchProfile } = useProfile();
    const [visible, setVisible] = useState(false);

    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleSaveProfile = () => {
        fetchProfile();
        setVisible(false);
    };

    useEffect(() => {
        if (profile && profile.status.topArtists) {
            musicService.getArtists(profile.status.topArtists.slice(0, 3)).then(setTopArtists);
        }
    }, [profile]);

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={styles.container}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={100}
            >
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
                            <Text style={styles.statsValue}>{profile?.status.likedCount || 0}</Text>
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
                            {profile?.status.topGenres && profile?.status.topGenres.length > 0 ? (
                                profile?.status.topGenres
                                    .slice(0, 2)
                                    .map((genre, i) => <GenreTag key={i} genre={genre} />)
                            ) : (
                                <Text style={styles.emptyStateText}>
                                    Ouça mais músicas para ver seus gêneros favoritos aqui!
                                </Text>
                            )}
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

                    <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModalVisible(true)}>
                        <Ionicons name="log-out-outline" size={20} color={color.error} />
                        <Text style={styles.logoutText}>Sair da conta</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>

            <Modal
                transparent
                visible={logoutModalVisible}
                animationType="fade"
                onRequestClose={() => setLogoutModalVisible(false)}
            >
                <BlurView
                    intensity={5}
                    tint="dark"
                    style={styles.logoutModalBlur}
                    experimentalBlurMethod="dimezisBlurView"
                >
                    <View style={styles.logoutModal}>
                        <Ionicons name="log-out-outline" size={40} color={color.error} />
                        <Text style={styles.logoutModalTitle}>Sair da conta</Text>
                        <Text style={styles.logoutModalSubtitle}>
                            Deseja realmente sair da sua conta?
                        </Text>
                        <View style={styles.logoutModalButtons}>
                            <TouchableOpacity
                                style={styles.logoutModalCancel}
                                onPress={() => setLogoutModalVisible(false)}
                            >
                                <Text style={styles.logoutModalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.logoutModalConfirm}
                                onPress={logout}
                            >
                                <Text style={styles.logoutModalConfirmText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
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
        width: "100%",
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

    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.dark,
        marginTop: 30,
        marginBottom: 40,
    },

    logoutText: {
        color: color.error,
        fontFamily: "Nexa-Bold",
        fontSize: 16,
    },

    logoutModalBlur: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    logoutModal: {
        width: "85%",
        backgroundColor: color.extraDark,
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        borderWidth: 1,
        borderColor: color.dark,
    },

    logoutModalTitle: {
        color: color.extraLight,
        fontSize: 22,
        fontFamily: "Nexa-Heavy",
        marginTop: 15,
    },

    logoutModalSubtitle: {
        color: color.light,
        fontSize: 15,
        fontFamily: "Nexa-Regular",
        marginTop: 8,
        textAlign: "center",
    },

    logoutModalButtons: {
        flexDirection: "row",
        gap: 12,
        marginTop: 25,
        width: "100%",
    },

    logoutModalCancel: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: color.dark,
        alignItems: "center",
    },

    logoutModalCancelText: {
        color: color.light,
        fontFamily: "Nexa-Bold",
        fontSize: 16,
    },

    logoutModalConfirm: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: color.error,
        alignItems: "center",
    },

    logoutModalConfirmText: {
        color: color.white,
        fontFamily: "Nexa-Bold",
        fontSize: 16,
    },
});
