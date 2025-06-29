import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { Chat } from "../../types";

const ChatItem = ({ chat, index }: { chat: Chat; index: number }) => {
    const navigator = useNavigation();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    const getTime = () => {
        const date = new Date(chat.lastMessageAt);

        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const imageSource = chat.otherParticipant.profilePictureUrl
        ? { uri: chat.otherParticipant.profilePictureUrl }
        : require("../../assets/users/default.png");

    return (
        <Animated.View
            style={[
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                },
            ]}
        >
            <Pressable
                style={styles.chatItemContainer}
                android_ripple={{ color: `${color.regular}20` }}
                onPress={() => {
                    navigator.navigate("ChatMessages", { chat });
                }}
            >
                <View style={styles.avatarContainer}>
                    <Image
                        source={imageSource}
                        style={styles.chatItemImage}
                        cachePolicy="memory-disk"
                        priority="high"
                    />
                    {/* {chat.online && <View style={styles.onlineIndicator} />}
                    {chat.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>
                                {chat.unread > 9 ? "9+" : chat.unread}
                            </Text>
                        </View>
                    )} */}
                </View>

                <View style={styles.chatItemInfo}>
                    <View style={styles.chatInfoHeader}>
                        <Text
                            style={[
                                styles.chatItemName,
                                // chat.unread > 0 && styles.chatItemNameUnread,
                            ]}
                        >
                            {chat.otherParticipant.displayName}
                        </Text>
                        <View style={styles.timeContainer}>
                            <Text style={styles.chatItemTime}>{getTime()}</Text>
                        </View>
                    </View>

                    <Text
                        style={[
                            styles.chatItemMessage,
                            // chat.unread > 0 && styles.chatItemMessageUnread,
                        ]}
                        numberOfLines={1}
                    >
                        {chat.lastMessage || "Sem mensagens"}
                    </Text>

                    {/* <Text style={styles.lastSeen}>{chat.lastSeen}</Text> */}
                </View>

                <View style={styles.chatItemActions}>
                    <Ionicons name="chevron-forward" style={styles.chevronIcon} />
                </View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    chatItemContainer: {
        flexDirection: "row",
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 5,
        backgroundColor: `${color.extraDark}80`,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: `${color.dark}60`,
        alignItems: "center",
    },

    avatarContainer: {
        position: "relative",
        marginRight: 15,
    },

    chatItemImage: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
        borderWidth: 2,
        borderColor: color.dark,
    },

    onlineIndicator: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#4CAF50",
        borderWidth: 2,
        borderColor: color.extraDark,
    },

    unreadBadge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: color.regular,
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: color.extraDark,
    },

    unreadText: {
        color: "white",
        fontSize: 12,
        fontFamily: "Nexa-Bold",
    },

    chatItemInfo: {
        flex: 1,
        gap: 4,
    },

    chatInfoHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    chatItemName: {
        fontSize: 16,
        fontFamily: "Nexa-Bold",
        color: color.extraLight,
    },

    chatItemNameUnread: {
        color: color.regular,
        fontFamily: "Nexa-Heavy",
    },

    timeContainer: {
        backgroundColor: `${color.dark}50`,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },

    chatItemTime: {
        fontSize: 11,
        fontFamily: "Nexa-Light",
        color: color.light,
    },

    chatItemMessage: {
        fontSize: 14,
        fontFamily: "Nexa-Regular",
        color: `${color.light}90`,
        lineHeight: 18,
    },

    chatItemMessageUnread: {
        color: color.extraLight,
        fontFamily: "Nexa-Bold",
    },

    lastSeen: {
        fontSize: 11,
        fontFamily: "Nexa-Light",
        color: `${color.light}60`,
        fontStyle: "italic",
    },

    chatItemActions: {
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    chevronIcon: {
        fontSize: 18,
        color: `${color.light}60`,
    },
});

export default ChatItem;
