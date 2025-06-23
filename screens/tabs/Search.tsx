import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { LinearGradient } from "expo-linear-gradient";
import { Music } from "../../types";
import { useMusic } from "../../api/music";
import { MusicRow } from "../../components/common";
import { useUser } from "../../api";

export default function Search() {
    const textColor = color.extraLight;
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    });

    const musicApi = useMusic();
    const userApi = useUser();

    const [querySongs, setQuerySongs] = useState<Array<Music> | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!search) setQuerySongs(null);
    }, [search]);

    const handleSearch = () => {
        if (!search) return;

        musicApi.getQuerySongs(search).then((songs) => {
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

    const handleSetNowMusic = async (musicId: string) => {
        const response = await userApi.updateProfileNowMusic(musicId);
        if (response) {
            alert("Música atualizada com sucesso!");
        }
    };

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={{ flex: 1 }}>
            <SafeAreaView style={styles.container}>
                <View style={styles.searchSection}>
                    <Ionicons name="search-outline" size={24} color={textColor}></Ionicons>
                    <TextInput
                        ref={inputRef}
                        style={styles.search}
                        onChangeText={setSearch}
                        onSubmitEditing={handleSearch}
                        placeholderTextColor={textColor}
                        placeholder="Digite para pesquisar..."
                    />
                </View>

                <View style={styles.searchResultsContainer}>
                    {querySongs && (
                        <ScrollView style={styles.searchResults} onScroll={handleScroll}>
                            {querySongs.map((music, i) => (
                                <MusicRow
                                    key={i}
                                    music={music}
                                    linkButtonIcon="add"
                                    linkButtonPress={() => handleSetNowMusic(music.id)}
                                />
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
