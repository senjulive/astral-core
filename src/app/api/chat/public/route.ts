import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateWallet } from '@/lib/wallet';
import { getUserRank } from '@/lib/ranks';
import { getCurrentTier } from '@/lib/tiers';
import { getBotTierSettingsServer } from '@/lib/tiers-server';

// Mock chat storage (in production, this would be a database)
let chatMessages: any[] = [
  {
    id: "welcome",
    userId: "system",
    displayName: "AstralCore",
    text: "Welcome to the AstralCore community chat! Share your trading experiences and connect with fellow traders.",
    timestamp: Date.now() - 3600000,
    rank: { name: "System", className: "text-primary", Icon: "AstralLogo" },
    tier: null,
    isAdmin: true
  }
];

export async function GET() {
  try {
    return NextResponse.json(chatMessages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, text, rank, tier } = body;

    if (!userId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user wallet data for display name
    const wallet = await getOrCreateWallet(userId);
    const displayName = wallet?.profile?.displayName || wallet?.profile?.username || `User${userId.slice(-4)}`;

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      displayName,
      avatarUrl: wallet?.profile?.avatarUrl,
      text: text.trim().slice(0, 500), // Limit message length
      timestamp: Date.now(),
      rank: rank || { name: "Recruit", className: "text-gray-500", Icon: "RecruitRankIcon" },
      tier: tier || null,
      isAdmin: false
    };

    chatMessages.push(newMessage);

    // Keep only last 100 messages to prevent memory issues
    if (chatMessages.length > 100) {
      chatMessages = chatMessages.slice(-100);
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error('Error posting chat message:', error);
    return NextResponse.json({ error: 'Failed to post message' }, { status: 500 });
  }
}
