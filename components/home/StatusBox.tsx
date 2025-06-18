import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import * as Color from "react-native-color-toolkit";

interface StatusBoxProps {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    number: number;
}

const StatusBox = ({ title, icon, color, number }: StatusBoxProps) => {
    const dynamicStyles = StyleSheet.create({
        statusContainer: {
            backgroundColor: Color.darken(color, 0.8),
            borderColor: Color.darken(color, 0.7),
        },
        statusTitle: {
            color: Color.desaturate(Color.brighten(color, 2), 0.85),
        },
        statusIcon: {
            color: color,
        },
        statusNumber: {
            color: Color.desaturate(Color.brighten(color, 0.5), 0.3),
        },
    });

    return (
        <View style={[staticStyles.statusContainer, dynamicStyles.statusContainer]}>
            <View style={staticStyles.status}>
                <Ionicons name={icon} style={[staticStyles.statusIcon, dynamicStyles.statusIcon]} />
                <Text style={[staticStyles.statusTitle, dynamicStyles.statusTitle]}>{title}</Text>
            </View>
            <Text style={[staticStyles.statusNumber, dynamicStyles.statusNumber]}>{number}</Text>
        </View>
    );
};

const staticStyles = StyleSheet.create({
    statusContainer: {
        width: "50%",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
    },

    status: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },

    statusTitle: {
        fontSize: 12,
        fontFamily: "Nexa-Heavy",
        marginLeft: 10,
    },

    statusIcon: {
        fontSize: 16,
    },

    statusNumber: {
        fontFamily: "Nexa-Heavy",
        fontSize: 15,
        marginTop: 10,
    },
});

export default StatusBox;
