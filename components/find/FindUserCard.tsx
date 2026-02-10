import { useState } from "react";
import { RecommendedUser } from "../../types";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { SkeletonLoader } from "../common";
import { color } from "../../theme.json";

const FindUserCard = ({ user }: { user: RecommendedUser }) => {
    const [imageIsLoading, setImageIsLoading] = useState(true);

    const imageSource = user.profilePictureUrl
        ? { uri: user.profilePictureUrl }
        : require("../../assets/users/default.png");

    return (
        <View style={styles.profileCard}>
            <View style={styles.profilePictureContainer}>
                <Image
                    source={imageSource}
                    style={styles.profilePicture}
                    priority={"high"}
                    cachePolicy={"memory-disk"}
                    onLoadEnd={() => setImageIsLoading(false)}
                />

                {imageIsLoading && <SkeletonLoader style={styles.profilePicture} />}
            </View>

            <View style={styles.profileInfoContainer}>
                <Text style={styles.profileName} numberOfLines={1}>
                    {user.displayName}
                </Text>
                <Text style={styles.profileBio} numberOfLines={1}>
                    {user.bio || "Sem biografia."}
                </Text>

                <View style={styles.profileInfoFooter}>
                    <Text style={styles.profileUsername}>@{user.username}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileCard: {
        flex: 1,
    },

    profilePictureContainer: {
        width: "100%",
        height: "80%",
    },

    profilePicture: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },

    profileInfoContainer: {
        height: "20%",
        backgroundColor: color.extraDark,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    profileName: {
        color: color.extraLight,
        fontFamily: "Nexa-Heavy",
        fontSize: 18,
        maxWidth: "95%",
    },

    profileBio: {
        color: `${color.extraLight}99`,
        fontFamily: "Nexa-Light",
        fontSize: 14,
    },

    profileInfoFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
    },

    profileUsername: {
        color: `${color.extraLight}99`,
        fontFamily: "Nexa-Light",
        fontSize: 12,
    },
});

export default FindUserCard;
