import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import * as Color from "react-native-color-toolkit";

interface TonalPalette {
    dark: string;
    light: string;
}

const tonalPalettes: TonalPalette[] = [
    // Paleta 1: Ciano/Teal
    { dark: "#0B292E", light: "#2DD4BF" },

    // Paleta 2: Azul
    { dark: "#172554", light: "#60A5FA" },

    // Paleta 3: Roxo/Índigo
    { dark: "#2E1046", light: "#A78BFA" },

    // Paleta 4: Rosa/Magenta
    { dark: "#420924", light: "#F472B6" },

    // Paleta 5: Vermelho
    { dark: "#450A0A", light: "#F87171" },

    // Paleta 6: Laranja/Âmbar
    { dark: "#422006", light: "#FBBF24" },

    // Paleta 7: Verde-Limão
    { dark: "#1A2E05", light: "#84CC16" },

    // Paleta 8: Verde-Esmeralda
    { dark: "#064E3B", light: "#34D399" },
];

const iconSet: (keyof typeof Ionicons.glyphMap)[] = ["musical-notes", "disc", "pulse", "flame", "star", "leaf", "radio", "contrast", "planet", "headset"];

const stringToHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Converte para um inteiro de 32bit
    }
    return Math.abs(hash);
};

interface GenreTagProps {
    genre: string;
}

const GenreTag = ({ genre }: GenreTagProps) => {
    const hash = stringToHash(genre);

    const selectedPalette = tonalPalettes[hash % tonalPalettes.length];
    const selectedIcon = iconSet[hash % iconSet.length];

    return (
        <View
            style={[
                styles.tagContainer,
                {
                    backgroundColor: selectedPalette.dark, // Fundo dinâmico escuro
                    borderColor: selectedPalette.light, // Borda dinâmica clara
                },
            ]}
        >
            <Ionicons
                name={selectedIcon}
                size={16}
                color={selectedPalette.light} // Cor do ícone da paleta
                style={styles.icon}
            />
            <Text style={[styles.tagText, { color: selectedPalette.light }]}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</Text>
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
        borderRadius: 10,
    },
    icon: {
        opacity: 0.8,
    },
    tagText: {
        fontSize: 14,
        fontFamily: "Nexa-Bold",
    },
});

export default GenreTag;
