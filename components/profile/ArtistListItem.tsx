import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Artist } from "../../services/MusicService";
import { color } from "../../theme.json";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";

interface ArtistListItemProps {
    artist: Artist;
    rank: number;
}

const ArtistListItem = ({ artist, rank }: ArtistListItemProps) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} priority={"high"} />
            <View style={styles.infoContainer}>
                <Text style={styles.artistName}>{artist.name}</Text>
                <Text style={styles.artistRank}>Top #{rank}</Text>
            </View>

            <TouchableOpacity style={styles.buttonLink} onPress={() => Linking.openURL(artist.linkUrl)}>
                <Ionicons name="open-outline" style={styles.buttonLinkIcon} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginBottom: 15,
    },
    artistImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    artistName: {
        color: color.extraLight,
        fontSize: 16,
        fontFamily: "Nexa-Bold",
    },
    artistRank: {
        color: color.light,
        opacity: 0.7,
        fontSize: 12,
        fontFamily: "Nexa-Light",
        marginTop: 4,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#34D399",
        marginLeft: 15,
    },

    buttonLink: {
        padding: 10,
        borderRadius: 50,
        backgroundColor: color.dark,
    },
    buttonLinkIcon: {
        color: color.extraLight,
        fontSize: 20,
    },
});

export default ArtistListItem;
