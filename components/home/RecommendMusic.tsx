import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Music } from "../../services/MusicService";
import { Image } from "expo-image";
import { color } from "../../theme.json";
import * as Linking from "expo-linking";

const RecommendMusic = ({ music }: { music: Music }) => {
    return (
        <TouchableOpacity key={music.name} style={styles.musicContainer} onPress={() => Linking.openURL(music.linkUrl)}>
            <Image source={{ uri: music.imageUrl }} style={styles.musicCover} priority={"high"} />
            <Text style={styles.musicName} numberOfLines={1}>
                {music.name}
            </Text>
            <Text style={styles.musicArtist} numberOfLines={1}>
                {music.artist}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    musicContainer: {
        backgroundColor: color.extraDark,
        borderWidth: 1.5,
        borderColor: color.dark,
        padding: 15,
        borderRadius: 10,
    },
    musicCover: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    musicName: {
        marginTop: 15,
        fontFamily: "Nexa-Bold",
        fontSize: 14,
        color: color.extraLight,
        maxWidth: 100,
    },
    musicArtist: {
        marginTop: 10,
        fontFamily: "Nexa-Bold",
        fontSize: 12,
        color: color.light,
        opacity: 0.7,
        maxWidth: 100,
    },
});

export default RecommendMusic;
