'use server';

import { NextResponse } from 'next/server';
import { createClan, getClanForUser, getClanById } from '@/lib/squad-clans';
import { getWalletByUserId, getAllWallets } from '@/lib/wallet';
import { getBotTierSettingsServer } from '@/lib/tiers-server';

// GET endpoint to fetch clan details for a user
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const clanId = searchParams.get('clanId');

    if (!userId && !clanId) {
        return NextResponse.json({ error: 'User ID or Clan ID is required' }, { status: 400 });
    }
    
    try {
        let clan;
        if (clanId) {
            clan = await getClanById(clanId);
        } else if(userId) {
            clan = await getClanForUser(userId);
        }

        if (!clan) {
            return NextResponse.json(null);
        }
        
        // Enhance with sub-leader info
        const allWallets = await getAllWallets();
        const membersWithRoles = clan.members.map(memberId => {
            const memberWallet = allWallets[memberId];
            const recruitedCount = memberWallet?.squad?.members?.length ?? 0;
            let role = 'member';
            if (memberId === clan.leaderId) {
                role = 'leader';
            } else if (recruitedCount >= 3) {
                role = 'sub-leader';
            }
            return {
                userId: memberId,
                role: role,
            };
        });

        return NextResponse.json({ ...clan, members: membersWithRoles });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to fetch clan data' }, { status: 500 });
    }
}


// POST endpoint to create a new clan
export async function POST(request: Request) {
    try {
        const { leaderId, name, avatarUrl } = await request.json();
        if (!leaderId || !name || !avatarUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newClan = await createClan(leaderId, name, avatarUrl);

        if (!newClan) {
             return NextResponse.json({ error: 'Failed to create clan. Requirements not met.' }, { status: 400 });
        }

        return NextResponse.json(newClan);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Failed to create clan' }, { status: 500 });
    }
}
