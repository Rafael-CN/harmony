import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileData } from "../../types";
import { color } from "../../theme.json";
import { useUser } from "../../api";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

const ProfileInfo = ({ profile, onEdit }: { profile: ProfileData | null; onEdit: () => void }) => {
    const userService = useUser();
    const [username, setUsername] = useState("");

    useEffect(() => {
        userService.getUsername().then(setUsername);
    }, []);

    const imageSource = profile?.profilePictureUrl
        ? { uri: profile.profilePictureUrl }
        : require("../../assets/users/1.png");

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
        borderRadius: 50,
        backgroundColor: color.extraDark,
        borderWidth: 1,
        borderColor: color.regular,
    },

    profileEditIcon: {
        fontSize: 20,
        color: color.regular,
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

export default ProfileInfo;
