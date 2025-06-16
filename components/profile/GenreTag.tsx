import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface GenreTagProps {
    genre: string;
}

const GenreTag = ({ genre }: GenreTagProps) => {
    const iconName = "musical-note"; //getIconForGenre(genre);

    return (
        <View style={styles.tagContainer}>
            {/* <Ionicons name={iconName} size={16} color={color.extraLight} style={styles.icon} /> */}
            <Text style={styles.tagText}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    tagContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 8,
        backgroundColor: color.dark,
        borderRadius: 10,
    },
    icon: {
        opacity: 0.8,
    },
    tagText: {
        color: color.light,
        fontSize: 14,
        fontFamily: "Nexa-Bold",
    },
});

export default GenreTag;
