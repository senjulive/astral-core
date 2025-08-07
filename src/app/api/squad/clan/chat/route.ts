'use server';

import { NextResponse } from 'next/server';
import { getClanForUser, addClanMessage, getClanMessages } from '@/lib/squad-clans';
import { getWalletByUserId } from '@/lib/wallet';
import { getUserRank } from '@/lib/ranks';
import { getCurrentTier } from '@/lib/tiers';
import { getBotTierSettingsServer } from '@/lib/tiers-server';

export async function POST(request: Request) {
    try {
        const { userId, text } = await request.json();
        if (!userId || !text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const clan = await getClanForUser(userId);
        if (!clan) {
            return NextResponse.json({ error: 'You are not part of a clan.' }, { status: 403 });
        }

        const [wallet, tierSettings] = await Promise.all([
            getWalletByUserId(userId),
            getBotTierSettingsServer()
        ]);

        if (!wallet) {
            return NextResponse.json({ error: 'User wallet not found.' }, { status: 404 });
        }

        const rank = getUserRank(wallet.balances.usdt ?? 0);
        const tier = await getCurrentTier(wallet.balances.usdt ?? 0, tierSettings);
        
        const displayName = wallet.profile.displayName || wallet.profile.username || userId;

        await addClanMessage(clan.id, {
            userId,
            text,
            displayName,
            avatarUrl: wallet.profile.avatarUrl,
            rank,
            tier,
        });

        return NextResponse.json({ success: true, message: 'Message sent' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const clan = await getClanForUser(userId);
        if (!clan) {
            return NextResponse.json([]); // Return empty array if not in a clan
        }
        
        const messages = await getClanMessages(clan.id);
        return NextResponse.json(messages);

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch clan messages' }, { status: 500 });
    }
}
