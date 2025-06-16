import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProfileData, useUser } from "../../services/UserService";
import { useEffect, useState } from "react";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

const ProfileEditModal = ({ profile, visible, setVisible, onSave }: { profile: ProfileData | null; visible: boolean; setVisible: (visible: boolean) => void; onSave: (editedData: ProfileData) => void }) => {
    const userService = useUser();

    const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);

    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (visible && profile) {
            setEditedProfile({ ...profile! });
            setSelectedImageUri(null);
        }
    }, [visible, profile]);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permissão de acesso à galeria negada.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            setSelectedImageUri(result.assets[0].uri);
        }
    };

    const handleSaveChanges = async () => {
        if (!editedProfile) return;
        setIsSaving(true);

        let finalProfileData = { ...editedProfile };

        if (selectedImageUri) {
            const newImageUrl = await userService.updateProfilePicture(selectedImageUri);
            if (newImageUrl) {
                finalProfileData.profilePictureUrl = newImageUrl;
            } else {
                alert("Erro ao atualizar a imagem de perfil.");
                setIsSaving(false);
                return;
            }
        }

        const textFieldsUpdated = await userService.updateProfile(editedProfile.displayName, editedProfile.bio);
        if (textFieldsUpdated) {
            onSave(finalProfileData);
        } else {
            alert("Não foi possível atualizar os dados do perfil.");
        }

        setIsSaving(false);
    };

    const imageSource = selectedImageUri ? { uri: selectedImageUri } : editedProfile?.profilePictureUrl ? { uri: editedProfile.profilePictureUrl } : require("../../assets/users/1.png");

    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <BlurView intensity={5} tint="dark" style={styles.blurContainer} experimentalBlurMethod="dimezisBlurView">
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar perfil</Text>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
                                <Ionicons name="close" size={24} color={color.light} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profilePictureContainer}>
                            <TouchableOpacity onPress={pickImage} disabled={isSaving}>
                                <Image source={imageSource} style={styles.profilePicture} />
                                <View style={styles.profilePictureOverlay}>
                                    <Ionicons name="camera" size={24} color={color.extraLight} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <TextInput style={styles.modalInput} placeholder="Nome de exibição" placeholderTextColor={color.light} value={editedProfile?.displayName} onChangeText={(value) => setEditedProfile({ ...editedProfile!, displayName: value })} />
                        <TextInput style={styles.modalInput} placeholder="Bio" multiline placeholderTextColor={color.light} value={editedProfile?.bio} onChangeText={(value) => setEditedProfile({ ...editedProfile!, bio: value })} />

                        <TouchableOpacity onPress={handleSaveChanges} disabled={isSaving}>
                            <LinearGradient colors={isSaving ? [color.dark, color.dark] : [color.regular, color.dark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalButton}>
                                {isSaving ? <ActivityIndicator color={color.extraLight} /> : <Text style={styles.modalButtonText}>Salvar</Text>}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

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

    const [visible, setVisible] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    useEffect(() => {
        userService.getProfile().then(setProfile);
    }, []);

    const handleSaveProfile = (editedData: ProfileData) => {
        setProfile(editedData);
        setVisible(false);
        console.log("Perfil salvo com sucesso!");
    };

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
                        <Text style={styles.statsValue}>10</Text>
                        <Text style={styles.statsTitle}>Seguidores</Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <Text style={styles.statsValue}>27</Text>
                        <Text style={styles.statsTitle}>Seguindo</Text>
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Gêneros favoritos</Text>
                    <View style={styles.genres}>
                        {profile?.status.topGenres.slice(0, 3).map((genre, i) => (
                            <Text key={i} style={styles.genre}>
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </Text>
                        ))}
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Artistas favoritos</Text>

                    <View style={styles.genres}>
                        {profile?.status.topArtists.slice(0, 3).map((genre, i) => (
                            <Text key={i} style={styles.genre}>
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </Text>
                        ))}
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

    genres: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
    },

    genre: {
        backgroundColor: color.dark,
        color: color.light,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 10,
        fontSize: 14,
        fontFamily: "Nexa-Bold",
    },

    blurContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        width: "90%",
        backgroundColor: color.extraDark,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    modalTitle: {
        color: color.extraLight,
        fontSize: 20,
        fontFamily: "Nexa-Bold",
    },

    closeButton: {
        padding: 5,
    },

    modalInput: {
        backgroundColor: color.dark,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        fontSize: 16,
        fontFamily: "Nexa-Light",
        color: color.extraLight,
        borderWidth: 1,
        borderColor: color.light,
        marginBottom: 20,
    },

    modalButton: {
        width: "100%",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
    },

    modalButtonText: {
        color: color.extraLight,
        fontSize: 16,
        fontFamily: "Nexa-Bold",
        textAlign: "center",
    },

    profilePictureContainer: {
        alignItems: "center",
        marginBottom: 20,
    },

    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: color.regular,
    },
    profilePictureOverlay: {
        position: "absolute",
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
});
