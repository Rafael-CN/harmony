import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ProfileData } from "../../services/UserService";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";

const HomeHeader = ({ profile }: { profile: ProfileData | null }) => {
    const navigator = useNavigation();

    const imageSource = profile?.profilePictureUrl ? { uri: profile.profilePictureUrl } : require("../../assets/users/1.png");

    return (
        <LinearGradient colors={["#1B1B28", "#000000"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
            <View style={styles.headerUser}>
                <Image style={styles.userImage} source={imageSource} priority={"high"} />
                <View style={styles.headerUserInfo}>
                    <Text style={styles.userText}>Bem vindo, {profile?.displayName}</Text>
                    <Text style={styles.userName}>@{profile?.username}</Text>
                </View>
            </View>

            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigator.navigate("Search" as never)}>
                    <Ionicons name="search-outline" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="settings-outline" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: color.dark,
    },

    headerUser: {
        flexDirection: "row",
        alignItems: "center",
    },

    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },

    headerUserInfo: {},

    userText: {
        color: color.extraLight,
        fontSize: 18,
        fontFamily: "Nexa-Heavy",
    },

    userName: {
        color: color.extraLight,
        fontSize: 14,
        fontFamily: "Nexa-ExtraLight",
    },

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconButton: {
        padding: 10,
        marginStart: 10,
        backgroundColor: color.extraDark,
        borderRadius: 50,
    },

    icon: {
        fontSize: 20,
        color: color.extraLight,
    },
});

export default HomeHeader;
