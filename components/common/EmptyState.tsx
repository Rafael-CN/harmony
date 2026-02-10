import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
}

const EmptyState = ({ icon, title, subtitle }: EmptyStateProps) => {
    return (
        <View style={styles.container}>
            <Ionicons name={icon} size={48} color={color.regular} />
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontFamily: "Nexa-Regular",
        fontSize: 18,
        color: color.extraLight,
        marginTop: 16,
        textAlign: "center",
    },
    subtitle: {
        fontFamily: "Nexa-Light",
        fontSize: 14,
        color: color.light,
        marginTop: 8,
        textAlign: "center",
    },
});

export default EmptyState;
