import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import { useRef, useEffect, useState } from "react";
import { ChatItem } from "../../components/chat";
import { useChat } from "../../context/ChatContext";
import { EmptyState, SkeletonLoader } from "../../components/common";

export default function ChatList() {
    const { chats, getMyChats, loadingChats } = useChat();

    const headerFadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        getMyChats();

        Animated.timing(headerFadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <LinearGradient colors={["#000000", `${color.extraDark}99`]} style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
                    <LinearGradient
                        colors={["#1B1B28", "#000000"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.headerGradient}
                    >
                        <Text style={styles.headerTitle}>Conversas</Text>
                        {/* <View style={styles.headerActions}>
                            <Pressable style={styles.headerButton}>
                                <Ionicons name="search-outline" style={styles.headerIcon} />
                            </Pressable>
                            <Pressable style={styles.headerButton}>
                                <Ionicons name="add-outline" style={styles.headerIcon} />
                            </Pressable>
                        </View> */}
                    </LinearGradient>
                </Animated.View>

                {loadingChats ? (
                    <View style={styles.skeletonContainer}>
                        {[0, 1, 2, 3].map((i) => (
                            <SkeletonLoader key={i} style={styles.skeletonItem} />
                        ))}
                    </View>
                ) : chats.length === 0 ? (
                    <EmptyState
                        icon="chatbox-outline"
                        title="Nenhuma conversa ainda"
                        subtitle="Descubra pessoas na aba Discover"
                    />
                ) : (
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {chats.map((chat, index) => (
                            <ChatItem key={chat.chatId} chat={chat} index={index} />
                        ))}
                    </ScrollView>
                )}
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
    },

    header: {
        marginBottom: 10,
    },

    headerGradient: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: color.dark,
    },

    headerTitle: {
        fontSize: 24,
        fontFamily: "Nexa-Heavy",
        color: color.extraLight,
    },

    headerActions: {
        flexDirection: "row",
        gap: 10,
    },

    headerButton: {
        padding: 10,
        backgroundColor: color.extraDark,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: color.dark,
    },

    headerIcon: {
        fontSize: 20,
        color: color.extraLight,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: 20,
    },

    skeletonContainer: {
        paddingHorizontal: 15,
        paddingTop: 10,
    },

    skeletonItem: {
        width: "100%",
        height: 70,
        borderRadius: 15,
        marginBottom: 15,
    },
});
