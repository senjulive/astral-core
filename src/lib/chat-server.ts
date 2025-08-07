// Mock implementation of chat functionality using a simple JSON structure.
import initialChats from '../../data/chats.json';
import { addPlatformNotification } from './notifications';

let mockChats: Record<string, any[]> = initialChats;

export type Message = {
  id: string;
  user_id: string;
  text: string;
  timestamp: number;
  sender: 'user' | 'admin';
  silent?: boolean;
  file_url?: string;
};

export type ChatMessage = Message;

export type ChatHistory = {
  [userId: string]: Message[];
};


// Admin function: Fetches all chats from the mock data.
export async function getAllChats(): Promise<ChatHistory> {
    return mockChats;
}

// Fetches chat history for a single user from the mock data.
export async function getChatHistoryForUser(userId: string): Promise<Message[]> {
    return mockChats[userId] || [];
}

// Universal function to send a message.
async function createMessage(
  userId: string,
  text: string,
  sender: 'user' | 'admin',
  silent: boolean,
  file_url?: string
): Promise<void> {
    if (!mockChats[userId]) {
        mockChats[userId] = [];
    }
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        user_id: userId,
        text,
        sender,
        silent,
        timestamp: Date.now(),
        file_url,
    };
    mockChats[userId].push(newMessage);

    if (sender === 'user' && !silent) {
        await addPlatformNotification({
            title: "New Support Message",
            content: `New message from ${userId}: "${text.substring(0, 50)}..."`,
            href: '/admin'
        });

        // Create an automated reply
        const autoReply: Message = {
            id: `msg-${Date.now() + 1}`,
            user_id: userId,
            text: "Thank you for your message. An admin will be with you shortly. (This is an automated reply)",
            sender: 'admin',
            silent: false,
            timestamp: Date.now() + 1,
        };
        mockChats[userId].push(autoReply);
    }
}

// Sends a message from a user.
export async function sendMessage(
  userId: string,
  text: string,
  fileDataUrl?: string,
): Promise<void> {
  // In a real app without Supabase storage, you'd upload this to another service (e.g., S3)
  // For this mock, we will just use the data URL directly if provided.
  return createMessage(userId, text, 'user', false, fileDataUrl);
}

// Sends a message from an admin.
export async function sendAdminMessage(userId: string, text: string): Promise<void> {
    return createMessage(userId, text, 'admin', false);
}

// Gets public chat messages from the public chat data file
export async function getPublicChatMessages(): Promise<any[]> {
    try {
        const path = require('path');
        const fs = require('fs/promises');
        const filePath = path.join(process.cwd(), 'src/data/public-chat.json');
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.warn('Could not read public chat data:', error);
        return [];
    }
}
