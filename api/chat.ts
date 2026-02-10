import api from "./api";
import { Chat, ChatMessage } from "../types";

async function getMyChats(): Promise<Array<Chat>> {
    try {
        const response = await api.get("chat");
        return response?.data;
    } catch {
        return [];
    }
}

async function getChatMessages(chatId: string): Promise<Array<ChatMessage>> {
    try {
        const response = await api.get(`chat/${chatId}/messages`);
        return response?.data;
    } catch {
        return [];
    }
}

async function sendMessage(chatId: string, message: string): Promise<ChatMessage | null> {
    try {
        const response = await api.post(`chat/${chatId}/messages`, { content: message });
        return response?.data;
    } catch {
        return null;
    }
}

export function useChatApi() {
    return {
        getMyChats,
        getChatMessages,
        sendMessage,
    };
}
