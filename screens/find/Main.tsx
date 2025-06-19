import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface NavigationCardProps {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    gradientColors: string[];
    onPress: () => void;
    delay?: number;
}

const NavigationCard = ({
    title,
    subtitle,
    icon,
    gradientColors,
    onPress,
    delay = 0,
}: NavigationCardProps) => {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={gradientColors as any}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} size={32} color={color.extraLight} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <Text style={styles.cardSubtitle}>{subtitle}</Text>
                    </View>

                    <View style={styles.arrowContainer}>
                        <Ionicons name="chevron-forward" size={24} color={color.light} />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

export default function Main() {
    const navigation = useNavigation();

    const handleNavigateToFindPeople = () => {
        navigation.navigate("FindPeople" as never);
    };

    const handleNavigateToFindMusic = () => {
        navigation.navigate("FindMusic" as never);
    };

    return (
        <LinearGradient colors={["#000000", color.extraDark]} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Descobrir</Text>
                    <Text style={styles.headerSubtitle}>
                        Encontre novas músicas e pessoas que combinam com seu gosto musical
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    <NavigationCard
                        title="Descobrir Pessoas"
                        subtitle="Conecte-se com pessoas que têm gostos musicais similares"
                        icon="people"
                        gradientColors={[color.extraDark, color.dark]}
                        onPress={handleNavigateToFindPeople}
                    />

                    <NavigationCard
                        title="Descobrir Músicas"
                        subtitle="Explore novas músicas baseadas nas suas preferências"
                        icon="musical-notes"
                        gradientColors={[color.extraDark, color.dark]}
                        onPress={handleNavigateToFindMusic}
                        delay={100}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="heart" size={20} color="#D6677F" />
                        <Text style={styles.infoText}>Deslize para a direita para curtir</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Ionicons name="close" size={20} color={color.light} />
                        <Text style={styles.infoText}>Deslize para a esquerda para pular</Text>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        paddingHorizontal: 20,
    },

    header: {
        marginTop: 40,
        marginBottom: 40,
        alignItems: "center",
    },

    headerTitle: {
        color: color.extraLight,
        fontSize: 32,
        fontFamily: "Nexa-Heavy",
        marginBottom: 10,
    },

    headerSubtitle: {
        color: color.light,
        fontSize: 16,
        fontFamily: "Nexa-Light",
        textAlign: "center",
        lineHeight: 22,
        opacity: 0.8,
    },

    cardsContainer: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
    },

    cardContainer: {
        width: "100%",
        height: 120,
        marginBottom: 15,
    },

    card: {
        flex: 1,
        borderRadius: 16,
        padding: 20,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },

    cardContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 60,
        height: 60,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },

    textContainer: {
        flex: 1,
        paddingRight: 10,
    },

    cardTitle: {
        color: color.extraLight,
        fontSize: 18,
        fontFamily: "Nexa-Bold",
        marginBottom: 5,
    },

    cardSubtitle: {
        color: color.light,
        fontSize: 14,
        fontFamily: "Nexa-Light",
        lineHeight: 18,
        opacity: 0.9,
    },

    arrowContainer: {
        opacity: 0.7,
    },

    infoContainer: {
        marginBottom: 30,
        gap: 15,
    },

    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    infoText: {
        color: color.light,
        fontSize: 14,
        fontFamily: "Nexa-Light",
        opacity: 0.8,
    },
});
