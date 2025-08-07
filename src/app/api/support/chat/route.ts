import { NextResponse } from 'next/server';
import { getChatHistoryForUser, sendMessage, sendAdminMessage, getAllChats } from '@/lib/chat-server';
import { type Message } from '@/lib/chat-server';

// This file acts as a proxy to the file-based chat system in lib/chat.ts
// It adds the 24-hour filtering logic.

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const history = await getChatHistoryForUser(userId);
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentHistory = history.filter(msg => msg.timestamp >= twentyFourHoursAgo);
        return NextResponse.json(recentHistory);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, text, fileDataUrl, sender } = body;

        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        if (sender === 'admin') {
            await sendAdminMessage(userId, text);
        } else {
            await sendMessage(userId, text, fileDataUrl);
        }

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}

// New endpoint for admins to get all chats
export async function PATCH() {
     try {
        const allChats = await getAllChats();
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);

        const recentChats: Record<string, Message[]> = {};
        for (const userId in allChats) {
            recentChats[userId] = allChats[userId].filter(msg => msg.timestamp >= twentyFourHoursAgo);
        }

        return NextResponse.json(recentChats);
    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to fetch all chats' }, { status: 500 });
    }
}
