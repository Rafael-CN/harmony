import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { color } from "../../theme.json";
import React from "react";
import SongItem from "../../components/SongItem";
import * as Color from "react-native-color-toolkit";
import { useNavigation } from "@react-navigation/native";

const StatusBox = ({ title, icon, color, number }: { title: string; icon: keyof typeof Ionicons.glyphMap; color: string; number: number }) => {
    const styles = StyleSheet.create({
        statusContainer: {
            width: "50%",
            backgroundColor: Color.darken(color, 0.8),
            paddingVertical: 15,
            paddingHorizontal: 20,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Color.darken(color, 0.7),
        },

        status: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
        },

        statusTitle: {
            color: Color.desaturate(Color.brighten(color, 2), 0.85),
            fontSize: 12,
            fontFamily: "Nexa-Heavy",
            marginLeft: 10,
        },

        statusIcon: {
            color: color,
            fontSize: 16,
        },

        statusNumber: {
            fontFamily: "Nexa-Heavy",
            color: Color.desaturate(Color.brighten(color, 0.5), 0.3),
            fontSize: 15,
            marginTop: 10,
        },
    });

    return (
        <View style={styles.statusContainer}>
            <View style={styles.status}>
                <Ionicons name={icon} style={styles.statusIcon} />
                <Text style={styles.statusTitle}>{title}</Text>
            </View>
            <Text style={styles.statusNumber}>{number}</Text>
        </View>
    );
};

const Header = () => {
    const navigator = useNavigation();

    const styles = StyleSheet.create({
        header: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderColor: color.dark,
            marginBottom: 20,
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

    return (
        <LinearGradient colors={["#1B1B28", "#000000"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.header}>
            <View style={styles.headerUser}>
                <Image style={styles.userImage} source={require("../../assets/users/1.png")} />
                <View style={styles.headerUserInfo}>
                    <Text style={styles.userText}>Bem vindo, Rafael</Text>
                    <Text style={styles.userName}>@rafael</Text>
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

const LikedSong = () => {
    const styles = StyleSheet.create({
        songContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 10,
            backgroundColor: color.extraDark,
            borderRadius: 10,
            marginBottom: 20,
        },

        songInfoContainer: {
            flexDirection: "row",
            alignItems: "center",
        },

        songCover: {
            width: 40,
            height: 40,
            borderRadius: 10,
        },

        songInfo: {
            marginLeft: 10,
        },

        songTitle: {
            color: color.extraLight,
            fontSize: 14,
            fontFamily: "Nexa-Heavy",
        },

        songArtist: {
            color: color.light,
            fontSize: 12,
            fontFamily: "Nexa-Light",
            marginTop: 5,
        },

        songLink: {
            padding: 10,
            borderRadius: 50,
            backgroundColor: color.dark,
        },

        songLinkIcon: {
            fontSize: 20,
            color: color.light,
        },
    });

    return (
        <View style={styles.songContainer}>
            <View style={styles.songInfoContainer}>
                <Image source={require("../../assets/song-cover.png")} style={styles.songCover} />
                <View style={styles.songInfo}>
                    <Text style={styles.songTitle}>Believer</Text>
                    <Text style={styles.songArtist}>Imagine Dragons</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.songLink}>
                <Ionicons name="open-outline" style={styles.songLinkIcon} />
            </TouchableOpacity>
        </View>
    );
};

export default function Home() {
    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" />

                <Header />

                <View style={styles.statusGroup}>
                    <StatusBox title="Músicas curtidas" icon="heart-outline" color="#d6677f" number={572} />
                    <StatusBox title="Amigos" icon="people-outline" color="#4F518C" number={25} />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Curtidas recentes</Text>
                        <Text style={styles.sectionLink}>Ver todas</Text>
                    </View>

                    <LikedSong />
                    <LikedSong />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    section: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
    },

    sectionHeader: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
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
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },

    scrollView: {
        flex: 1,
    },
});
