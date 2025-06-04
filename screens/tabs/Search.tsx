import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { Music, useMusic } from "../../services/MusicService";
import SongItem from "../../components/SongItem";

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
        <SafeAreaView style={styles.container}>
            <View style={styles.searchSection}>
                <Ionicons name="search" size={24} color={textColor}></Ionicons>
                <TextInput ref={inputRef} style={styles.search} onChangeText={setSearch} onSubmitEditing={handleSearch} placeholderTextColor={textColor} placeholder="Digite para pesquisar..." />
            </View>

            <View style={styles.searchResultsContainer}>
                {querySongs && (
                    <ScrollView style={styles.searchResults} onScroll={handleScroll}>
                        {querySongs.map((music, i) => (
                            <SongItem key={i} music={music} />
                        ))}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: color.extraDark,
    },

    searchSection: {
        marginTop: "5%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.dark,
        paddingVertical: "3%",
        paddingHorizontal: "4%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.regular,
    },

    search: {
        width: "75%",
        marginLeft: "2%",
        color: color.extraLight,
    },

    searchResultsContainer: {
        width: "100%",
    },

    searchResults: {
        marginTop: "5%",
        width: "100%",
    },
});
