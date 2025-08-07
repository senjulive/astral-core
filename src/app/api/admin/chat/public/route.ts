'use server';

import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { ChatMessage } from '@/lib/chat-server';

const CHAT_FILE_PATH = path.join(process.cwd(), 'data', 'public-chat.json');

async function readChatFile(): Promise<ChatMessage[]> {
  try {
    const data = await fs.readFile(CHAT_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

async function writeChatFile(messages: ChatMessage[]): Promise<void> {
  await fs.writeFile(CHAT_FILE_PATH, JSON.stringify(messages, null, 2), 'utf-8');
}


export async function DELETE(request: Request) {
    try {
        const { messageId } = await request.json();
        if (!messageId) {
            return NextResponse.json({ error: 'Message ID is required' }, { status: 400 });
        }
        
        const messages = await readChatFile();
        const updatedMessages = messages.filter(msg => msg.id !== messageId);

        if (messages.length === updatedMessages.length) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }

        await writeChatFile(updatedMessages);

        return NextResponse.json({ success: true, message: 'Message deleted successfully.' });

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
    }
}
