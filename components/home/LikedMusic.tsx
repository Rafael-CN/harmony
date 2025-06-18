import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Music } from "../../services/MusicService";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";

const LikedMusic = ({ music }: { music: Music }) => {
    return (
        <View style={styles.songContainer}>
            <View style={styles.songInfoContainer}>
                <Image source={{ uri: music.imageUrl }} style={styles.songCover} priority={"high"} />
                <View style={styles.songInfo}>
                    <Text style={styles.songTitle} numberOfLines={1}>
                        {music.name}
                    </Text>
                    <Text style={styles.songArtist}>{music.artist}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.songLink} onPress={() => Linking.openURL(music.linkUrl)}>
                <Ionicons name="open-outline" style={styles.songLinkIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    songContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
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
        width: 200,
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

export default LikedMusic;
