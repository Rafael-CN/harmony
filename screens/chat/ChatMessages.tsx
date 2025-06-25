import { LinearGradient } from "expo-linear-gradient";
import { color } from "../../theme.json";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useRef, useEffect, useState } from "react";
import { MessageBubble } from "../../components/chat";
import { Chat, ChatMessage } from "../../types";
import { useChat } from "../../context/ChatContext";

export default function ChatMessages() {
    const navigation = useNavigation();

    const {
        chatMessages: activeChatMessages,
        getChatMessages,
        loadingMessages,
        sendMessage,
        leaveChat,
    } = useChat();

    const route = useRoute();
    const params = route.params as { chat: Chat };
    const chat = params.chat;

    const [messageText, setMessageText] = useState("");

    const scrollViewRef = useRef<ScrollView>(null);

    const headerFadeAnim = useRef(new Animated.Value(0)).current;
    const inputFadeAnim = useRef(new Animated.Value(0)).current;

    const fetchMessages = async () => {
        await getChatMessages(chat.chatId);
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        fetchMessages();

        Animated.parallel([
            Animated.timing(headerFadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(inputFadeAnim, {
                toValue: 1,
                duration: 600,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();

        return () => {
            leaveChat(chat.chatId);
        };
    }, [chat.chatId]);

    const handleSendMessage = async () => {
        if (messageText.trim()) {
            await sendMessage(chat.chatId, messageText);
            setMessageText("");

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    };

    Keyboard.addListener("keyboardDidShow", () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    });

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
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Ionicons name="chevron-back" style={styles.backIcon} />
                            </TouchableOpacity>

                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{ uri: chat.otherParticipant.profilePictureUrl }}
                                    style={styles.headerAvatar}
                                    cachePolicy="memory-disk"
                                    priority="high"
                                />
                                {/* {chatData.online && <View style={styles.onlineIndicator} />} */}
                            </View>

                            <View style={styles.headerInfo}>
                                <Text style={styles.headerName}>
                                    {chat.otherParticipant.displayName}
                                </Text>
                                {/* <Text style={styles.headerStatus}>{chatData.lastSeen}</Text> */}
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.messagesContainer}
                        contentContainerStyle={styles.messagesContent}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            scrollViewRef.current?.scrollToEnd({ animated: true })
                        }
                        fadingEdgeLength={100}
                    >
                        {activeChatMessages.map((message, index) => (
                            <MessageBubble key={message.id} message={message} index={index} />
                        ))}
                    </ScrollView>

                    <Animated.View style={[styles.inputContainer, { opacity: inputFadeAnim }]}>
                        <LinearGradient
                            colors={[`${color.extraDark}E6`, `${color.dark}E6`]}
                            style={styles.inputGradient}
                        >
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Digite uma mensagem..."
                                    placeholderTextColor={`${color.light}60`}
                                    value={messageText}
                                    onChangeText={setMessageText}
                                    multiline
                                    maxLength={500}
                                />
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.sendButton,
                                    messageText.trim() && styles.sendButtonActive,
                                ]}
                                onPress={handleSendMessage}
                                disabled={!messageText.trim()}
                            >
                                <Ionicons
                                    name="send"
                                    style={[
                                        styles.sendIcon,
                                        messageText.trim() && styles.sendIconActive,
                                    ]}
                                />
                            </TouchableOpacity>
                        </LinearGradient>
                    </Animated.View>
                </KeyboardAvoidingView>
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

    keyboardView: {
        flex: 1,
    },

    header: {
        borderBottomWidth: 1,
        borderBottomColor: color.dark,
    },

    headerGradient: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 15,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },

    backButton: {
        padding: 8,
        marginRight: 10,
    },

    backIcon: {
        fontSize: 24,
        color: color.extraLight,
    },

    avatarContainer: {
        position: "relative",
        marginRight: 12,
    },

    headerAvatar: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        borderWidth: 2,
        borderColor: color.dark,
    },

    onlineIndicator: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#4CAF50",
        borderWidth: 2,
        borderColor: color.extraDark,
    },

    headerInfo: {
        flex: 1,
    },

    headerName: {
        fontSize: 18,
        fontFamily: "Nexa-Bold",
        color: color.extraLight,
    },

    headerStatus: {
        fontSize: 12,
        fontFamily: "Nexa-Light",
        color: `${color.light}80`,
        marginTop: 2,
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
        fontSize: 18,
        color: color.extraLight,
    },

    messagesContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },

    messagesContent: {
        paddingVertical: 20,
        paddingBottom: 10,
    },

    inputContainer: {
        paddingBottom: 15,
    },

    inputGradient: {
        marginHorizontal: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: `${color.dark}60`,
    },

    inputWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        maxHeight: 100,
    },

    textInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: "Nexa-Regular",
        color: color.extraLight,
        paddingVertical: 10,
        paddingRight: 10,
        maxHeight: 80,
    },

    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: color.dark,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    sendButtonActive: {
        backgroundColor: color.regular,
    },

    sendIcon: {
        fontSize: 18,
        color: `${color.light}60`,
    },

    sendIconActive: {
        color: "white",
    },
});
