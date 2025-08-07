// Client-side chat utilities that use API endpoints
// This file is safe to import in client components

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

// Client-side functions that use API endpoints instead of direct file system access

export async function sendAdminMessage(
  userId: string,
  text: string,
  silent: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/support/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        text,
        silent,
        sender: 'admin'
      }),
    });

    return await response.json();
  } catch (error) {
    return { success: false, error: 'Network error occurred' };
  }
}

export async function getAllChats(): Promise<ChatHistory> {
  try {
    const response = await fetch('/api/admin/chat/public');
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chats:', error);
    return {};
  }
}

export async function getChatHistory(userId: string): Promise<Message[]> {
  try {
    const response = await fetch(`/api/support/chat?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }
    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
}

export async function getPublicChatMessages(): Promise<any[]> {
  try {
    const response = await fetch('/api/chat/public');
    if (!response.ok) {
      throw new Error('Failed to fetch public chat messages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching public chat messages:', error);
    return [];
  }
}
