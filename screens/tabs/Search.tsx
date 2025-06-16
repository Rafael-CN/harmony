import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { Music, useMusic } from "../../services/MusicService";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as Linking from "expo-linking";

const LikedMusic = ({ music }: { music: Music }) => {
    const styles = StyleSheet.create({
        songContainer: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 15,
            backgroundColor: color.extraDark,
            borderRadius: 10,
            marginBottom: 15,
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

export default function Search() {
    const textColor = color.extraLight;
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    });

    const musicService = useMusic();

    const [querySongs, setQuerySongs] = useState<Array<Music> | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!search) setQuerySongs(null);
    }, [search]);

    const handleSearch = () => {
        if (!search) return;

        musicService.getQuerySongs(search).then((songs) => {
            setQuerySongs(songs);
        });
    };

    const handleScroll = (event: any) => {
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollY = event.nativeEvent.contentOffset.y;
        const diff = scrollY / (contentHeight - scrollViewHeight);

        // console.log(diff);
    };

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.searchSection}>
                    <Ionicons name="search-outline" size={24} color={textColor}></Ionicons>
                    <TextInput ref={inputRef} style={styles.search} onChangeText={setSearch} onSubmitEditing={handleSearch} placeholderTextColor={textColor} placeholder="Digite para pesquisar..." />
                </View>

                <View style={styles.searchResultsContainer}>
                    {querySongs && (
                        <ScrollView style={styles.searchResults} onScroll={handleScroll}>
                            {querySongs.map((music, i) => (
                                <LikedMusic key={i} music={music} />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },

    searchSection: {
        marginTop: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.extraDark,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: color.regular,
    },

    search: {
        width: "80%",
        marginLeft: 5,
        color: color.extraLight,
        fontFamily: "Nexa-Regular",
    },

    searchResultsContainer: {
        width: "100%",
        paddingHorizontal: 20,
    },

    searchResults: {
        marginTop: "5%",
        width: "100%",
    },
});
