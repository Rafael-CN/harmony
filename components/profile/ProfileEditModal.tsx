import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";
import { ProfileData } from "../../types";
import { useProfileApi } from "../../api/profile";
import { HButton, HTextInput } from "../common";

interface ProfileEditModalProps {
    profile: ProfileData | null;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    onSave: (editedData: ProfileData) => void;
}

const ProfileEditModal = ({ profile, visible, setVisible, onSave }: ProfileEditModalProps) => {
    const userService = useProfileApi();

    const [editedProfile, setEditedProfile] = useState<ProfileData | null>(null);

    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (visible && profile) {
            setEditedProfile({ ...profile! });
            setSelectedImageUri(null);
            setErrorMessage("");
        }
    }, [visible, profile]);

    const pickImage = async () => {
        setErrorMessage("");
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            setErrorMessage("Permissão de acesso à galeria negada.");
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
        setErrorMessage("");

        let finalProfileData = { ...editedProfile };

        if (selectedImageUri) {
            const newImageUrl = await userService.updateProfilePicture(selectedImageUri);
            if (newImageUrl) {
                finalProfileData.profilePictureUrl = `${newImageUrl}?v=${Date.now()}`;
            } else {
                setErrorMessage("Erro ao atualizar a imagem de perfil.");
                setIsSaving(false);
                return;
            }
        }

        const textFieldsUpdated = await userService.updateProfile(
            editedProfile.displayName,
            editedProfile.bio
        );
        if (textFieldsUpdated) {
            onSave(finalProfileData);
        } else {
            setErrorMessage("Não foi possível atualizar os dados do perfil.");
        }

        setIsSaving(false);
    };

    const imageSource = selectedImageUri
        ? { uri: selectedImageUri }
        : editedProfile?.profilePictureUrl
        ? { uri: editedProfile.profilePictureUrl }
        : require("../../assets/users/default.png");

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => setVisible(false)}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <BlurView
                    intensity={5}
                    tint="dark"
                    style={styles.blurContainer}
                    experimentalBlurMethod="dimezisBlurView"
                >
                    <View style={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar perfil</Text>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setVisible(false)}
                            >
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

                        <HTextInput
                            style={{ width: "100%" }}
                            placeholder="Nome de exibição"
                            placeholderTextColor={color.light}
                            value={editedProfile?.displayName}
                            onChangeText={(value) =>
                                setEditedProfile({ ...editedProfile!, displayName: value })
                            }
                        />
                        <HTextInput
                            style={{ width: "100%" }}
                            placeholder="Bio"
                            multiline
                            placeholderTextColor={color.light}
                            value={editedProfile?.bio}
                            onChangeText={(value) =>
                                setEditedProfile({ ...editedProfile!, bio: value })
                            }
                        />

                        {errorMessage !== "" && (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        )}

                        <HButton
                            style={{ width: "100%" }}
                            onPress={handleSaveChanges}
                            disabled={isSaving}
                            text="Salvar"
                        />
                    </View>
                </BlurView>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        borderColor: color.dark,
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

    profilePictureContainer: {
        alignItems: "center",
    },

    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: color.regular,
    },
    errorText: {
        color: color.error,
        fontFamily: "Nexa-Light",
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
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

export default ProfileEditModal;
