import api from "./api";
import { Chat, ChatMessage } from "../types";

async function getMyChats(): Promise<Array<Chat>> {
    const response = await api.get("chat");
    return response?.data;
}

async function getChatMessages(chatId: string): Promise<Array<ChatMessage>> {
    const response = await api.get(`chat/${chatId}/messages`);
    return response?.data;
}

async function sendMessage(chatId: string, message: string): Promise<ChatMessage> {
    const response = await api.post(`chat/${chatId}/messages`, { content: message });
    return response?.data;
}

export function useChatApi() {
    return {
        getMyChats,
        getChatMessages,
        sendMessage,
    };
}
