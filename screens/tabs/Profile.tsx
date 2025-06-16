import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileData, useUser } from "../../services/UserService";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { ProfileEditModal } from "../../components/profile";
import { Artist, useMusic } from "../../services/MusicService";
import ArtistListItem from "../../components/profile/ArtistListItem";
import GenreTag from "../../components/profile/GenreTag";

const ProfileInfo = ({ profile, onEdit }: { profile: ProfileData | null; onEdit: () => void }) => {
    const styles = StyleSheet.create({
        profileContainer: {
            paddingHorizontal: 25,
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            marginBottom: 10,
        },

        profileImage: {
            width: 100,
            height: 100,
            borderRadius: 50,
            marginRight: 25,
        },

        profileInfo: {
            flex: 1,
        },

        profileNameContainer: {
            flexDirection: "row",
            alignItems: "center",
        },

        profileName: {
            color: color.extraLight,
            fontSize: 26,
            fontFamily: "Nexa-Heavy",
            marginRight: "auto",
        },

        profileEdit: {
            padding: 10,
            marginStart: 10,
            backgroundColor: color.extraDark,
            borderRadius: 50,
        },

        profileEditIcon: {
            color: color.extraLight,
            fontSize: 20,
        },

        profileUsername: {
            color: color.extraLight,
            opacity: 0.5,
            fontSize: 14,
            fontFamily: "Nexa-Light",
        },

        profileBio: {
            color: color.extraLight,
            fontSize: 14,
            fontFamily: "Nexa-Light",
            marginTop: 10,
        },
    });

    const userService = useUser();
    const [username, setUsername] = useState("");

    useEffect(() => {
        userService.getUsername().then(setUsername);
    }, []);

    const imageSource = profile?.profilePictureUrl ? { uri: profile.profilePictureUrl } : require("../../assets/users/1.png");

    return (
        <View style={styles.profileContainer}>
            <Image source={imageSource} style={styles.profileImage} priority={"high"} />
            <View style={styles.profileInfo}>
                <View style={styles.profileNameContainer}>
                    <Text style={styles.profileName}>{profile?.displayName}</Text>

                    <TouchableOpacity style={styles.profileEdit} onPress={onEdit}>
                        <Ionicons style={styles.profileEditIcon} name="create-outline"></Ionicons>
                    </TouchableOpacity>
                </View>
                <Text style={styles.profileUsername}>@{username}</Text>
                <Text style={styles.profileBio}>{profile?.bio}</Text>
            </View>
        </View>
    );
};

export default function Profile() {
    const userService = useUser();
    const musicService = useMusic();

    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    const [topArtists, setTopArtists] = useState<Array<Artist>>([]);

    useEffect(() => {
        userService.getProfile().then(setProfile);
    }, []);

    const handleSaveProfile = (editedData: ProfileData) => {
        setProfile(editedData);
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
                <ProfileEditModal profile={profile} visible={visible} setVisible={setVisible} onSave={handleSaveProfile} />
                <ProfileInfo profile={profile} onEdit={() => setVisible(true)} />

                <View style={styles.stats}>
                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>{profile?.status.likedCount}</Text>
                        <Text style={styles.statsTitle}>Curtidas</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>0</Text>
                        <Text style={styles.statsTitle}>Seguidores</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>0</Text>
                        <Text style={styles.statsTitle}>Seguindo</Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Gêneros favoritos</Text>
                    <View style={styles.genresContainer}>
                        {profile?.status.topGenres.slice(0, 3).map((genre, i) => (
                            <GenreTag key={i} genre={genre} />
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Artistas favoritos</Text>

                    <View style={styles.artistListContainer}>{topArtists.length > 0 ? topArtists.map((artist, i) => <ArtistListItem key={artist.id} artist={artist} rank={i + 1} />) : <Text style={styles.emptyStateText}>Ouça mais músicas para ver seus artistas favoritos aqui!</Text>}</View>
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
