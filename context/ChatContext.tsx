import React, { use, useEffect, useRef, useState } from "react";
import { Chat, ChatMessage } from "../types";
import { useChatApi } from "../api";
import { useAuth } from "./AuthContext";
import * as signalR from "@microsoft/signalr";
import { useProfile } from "./ProfileContext";

interface IChatContext {
    chats: Chat[];
    loadingChats: boolean;
    chatMessages: ChatMessage[];
    loadingMessages: boolean;
    getMyChats: () => Promise<void>;
    getChatMessages: (chatId: string) => Promise<void>;
    sendMessage: (chatId: string, message: string) => Promise<void>;
    leaveChat: (chatId: string) => Promise<void>;
}

const ChatContext = React.createContext<IChatContext | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const { userToken } = useAuth();
    const { profile } = useProfile();
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const chatApi = useChatApi();

    const [chats, setChats] = useState<Chat[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const userIdRef = useRef<string | null>(null);
    const activeChatIdRef = useRef<string | null>(null);

    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        activeChatIdRef.current = activeChatId;
    }, [activeChatId]);

    useEffect(() => {
        userIdRef.current = profile?.userId || null;
    }, [profile?.userId]);

    useEffect(() => {
        if (userToken) {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.EXPO_PUBLIC_SIGNALR_URL, {
                    accessTokenFactory: () => userToken,
                })
                .withAutomaticReconnect()
                .build();

            connectionRef.current = connection;

            connection.on("ReceiveMessage", (newMessage) => {
                console.log("Nova mensagem recebida via SignalR:", newMessage);

                if (newMessage.chatId === activeChatIdRef.current) {
                    const messageWithIsMe = {
                        ...newMessage,
                        isMe: newMessage.senderId === userIdRef.current,
                    };

                    setChatMessages((prevMessages) => [...prevMessages, messageWithIsMe]);
                    console.log("Mensagem adicionada à lista de mensagens");
                }

                setChats((prevChats) => {
                    const chatIndex = prevChats.findIndex((c) => c.chatId === newMessage.chatId);
                    if (chatIndex === -1) return prevChats;

                    const updatedChat = {
                        ...prevChats[chatIndex],
                        lastMessage: newMessage.content,
                        lastMessageAt: newMessage.createdAt,
                    };

                    const filteredChats = prevChats.filter((c) => c.chatId !== newMessage.chatId);
                    return [updatedChat, ...filteredChats];
                });
            });

            connection
                .start()
                .then(() => console.log("SignalR Conectado com sucesso!"))
                .catch((err) => console.error("Erro na conexão SignalR: ", err));

            return () => {
                connection.stop();
                connectionRef.current = null;
            };
        }
    }, [userToken]);

    const getMyChats = async () => {
        setLoadingChats(true);

        try {
            const chats = await chatApi.getMyChats();
            setChats(chats);
        } catch (error) {
            console.error("Erro ao buscar chats:", error);
        } finally {
            setLoadingChats(false);
        }
    };

    const getChatMessages = async (chatId: string) => {
        setLoadingMessages(true);
        try {
            const messages = (await chatApi.getChatMessages(chatId)).map((message) => {
                message.isMe = message.senderId === profile?.userId;
                return message;
            });

            setActiveChatId(chatId);
            setChatMessages(messages.reverse());

            if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
                await connectionRef.current.invoke("JoinChat", chatId);
                console.log(`Entrou no grupo do chat: ${chatId}`);
            }
        } catch (error) {
            console.error("Erro ao buscar mensagens:", error);
        } finally {
            setLoadingMessages(false);
        }
    };

    const sendMessage = async (chatId: string, message: string) => {
        try {
            const newMessage = await chatApi.sendMessage(chatId, message);
            if (!newMessage) {
                console.error("Erro ao enviar mensagem.");
                return;
            }
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    const leaveChat = async (chatId: string) => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            try {
                await connectionRef.current.invoke("LeaveChat", chatId);
                setChatMessages([]);
                setActiveChatId(null);
            } catch (err) {
                console.error("Erro ao sair do grupo do chat:", err);
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                loadingChats,
                chatMessages,
                loadingMessages,
                getMyChats,
                getChatMessages,
                sendMessage,
                leaveChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = (): IChatContext => {
    const context = React.useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
