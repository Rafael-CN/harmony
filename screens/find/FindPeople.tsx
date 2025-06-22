import { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import SwipeCard from "./SwipeCard";
import { useDiscovery } from "../../api/discovery";
import { RecommendedUser } from "../../types";
import { color } from "../../theme.json";

const UserCard = ({ user }: { user: RecommendedUser }) => {
    const imageSource = user.profilePictureUrl
        ? { uri: user.profilePictureUrl }
        : require("../../assets/users/default.png");

    return (
        <ImageBackground source={imageSource} style={{ flex: 1 }}>
            <LinearGradient
                style={style.cardBackground}
                colors={["#00000000", color.extraDark + "BB"]}
            >
                <View style={style.textOverlay}>
                    <View>
                        <Text
                            style={{
                                color: color.extraLight,
                                fontFamily: "Nexa-Heavy",
                                fontSize: 36,
                            }}
                        >
                            {user.displayName}
                        </Text>
                        {user.bio && (
                            <Text
                                style={{
                                    color: color.extraLight,
                                    fontFamily: "Nexa-Light",
                                    maxWidth: 200,
                                }}
                            >
                                {user.bio}
                            </Text>
                        )}
                    </View>
                    <View style={style.ageInfo}>
                        <Text
                            style={{
                                color: color.extraLight,
                                fontFamily: "Nexa-Heavy",
                                fontSize: 22,
                            }}
                        >
                            {`${Math.round(user.compatibilityScore * 100)}%`}
                        </Text>
                        <Text style={{ color: color.extraLight, fontFamily: "Nexa-Light" }}>
                            Compatível
                        </Text>
                    </View>
                </View>
            </LinearGradient>
        </ImageBackground>
    );
};

export default function FindPeople() {
    const [users, setUsers] = useState<RecommendedUser[]>([]);
    const [page, setPage] = useState(1);
    const discoveryApi = useDiscovery();

    const fetchUsers = async () => {
        const newUsers = await discoveryApi.getRecommendedUsers(page);
        setUsers((prev) => [...prev, ...newUsers]);
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSwipe = (direction: "left" | "right") => {
        setUsers((prev) => prev.slice(1));

        if (users.length <= 3) {
            fetchUsers();
        }
    };

    const currentUser = users[0];
    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
            <SwipeCard onSwipeEnd={handleSwipe}>
                {currentUser && <UserCard user={currentUser} />}
            </SwipeCard>
        </LinearGradient>
    );
}

const style = StyleSheet.create({
    cardBackground: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },

    music: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.extraDark,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        gap: 15,
    },

    musicInfo: {
        gap: 2,
        maxWidth: 150,
    },

    musicAlbum: {
        height: 40,
        width: 40,
        borderRadius: 5,
    },

    equalizer: {
        height: 12,
        width: 20,
    },

    textOverlay: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },

    ageInfo: {
        marginTop: 10,
    },
});
