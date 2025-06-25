import { Animated, StyleSheet, Text, View } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { color } from "../../theme.json";
import { ChatMessage } from "../../types";

const MessageBubble = ({ message, index }: { message: ChatMessage; index: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(message.isMe ? 50 : -50)).current;

    const getTime = () => {
        const date = new Date(message.createdAt);

        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay: index * 50,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay: index * 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.messageContainer,
                message.isMe ? styles.myMessageContainer : styles.otherMessageContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                },
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    message.isMe ? styles.myMessageBubble : styles.otherMessageBubble,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        message.isMe ? styles.myMessageText : styles.otherMessageText,
                    ]}
                >
                    {message.content}
                </Text>

                <View style={styles.messageFooter}>
                    <Text
                        style={[
                            styles.messageTime,
                            message.isMe ? styles.myMessageTime : styles.otherMessageTime,
                        ]}
                    >
                        {getTime()}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    messageContainer: {
        marginVertical: 3,
        maxWidth: "80%",
    },

    myMessageContainer: {
        alignSelf: "flex-end",
    },

    otherMessageContainer: {
        alignSelf: "flex-start",
    },

    messageBubble: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },

    myMessageBubble: {
        backgroundColor: color.regular,
        borderColor: `${color.regular}40`,
        borderTopRightRadius: 5,
    },

    otherMessageBubble: {
        backgroundColor: `${color.extraDark}E6`,
        borderColor: `${color.dark}60`,
        borderTopLeftRadius: 5,
    },

    messageText: {
        fontSize: 15,
        lineHeight: 20,
        fontFamily: "Nexa-Regular",
    },

    myMessageText: {
        color: "white",
    },

    otherMessageText: {
        color: color.extraLight,
    },

    messageFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        marginTop: 5,
        gap: 5,
    },

    messageTime: {
        fontSize: 11,
        fontFamily: "Nexa-Light",
    },

    myMessageTime: {
        color: "rgba(255,255,255,0.7)",
    },

    otherMessageTime: {
        color: `${color.light}60`,
    },

    messageStatus: {
        marginLeft: 3,
    },

    statusIcon: {
        fontSize: 14,
        color: "rgba(255,255,255,0.7)",
    },

    readIcon: {
        color: "#4CAF50",
    },
});

export default MessageBubble;
