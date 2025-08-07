
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { getRewardSettings } from '@/lib/rewards';
import { addNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const { userId, type, key, referralId } = await request.json();

    if (!userId || !type || !key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const [wallet, rewardSettings] = await Promise.all([
      getWalletByUserId(userId),
      getRewardSettings(),
    ]);
    
    if (!wallet) {
      return NextResponse.json({ error: 'User wallet not found.' }, { status: 404 });
    }

    let bonusAmount = 0;
    let claimedMessage = '';
    const claimedAchievements = wallet.claimed_achievements || { ranks: [], tiers: [] };
    const claimedReferrals = wallet.claimed_referrals || [];

    if (type === 'rank' || type === 'tier') {
        const settingsKey = type === 'rank' ? 'rankAchievementBonus' : 'tierAchievementBonus';
        if (claimedAchievements[type + 's']?.includes(key)) {
            return NextResponse.json({ error: 'Reward already claimed.' }, { status: 400 });
        }
        bonusAmount = rewardSettings[settingsKey] || 0;
        claimedAchievements[type + 's'].push(key);
        claimedMessage = `You claimed the ${key} achievement bonus!`;
    } else if (type === 'referral') {
        if (claimedReferrals.includes(referralId)) {
            return NextResponse.json({ error: 'Referral bonus already claimed.' }, { status: 400 });
        }
        const totalReferrals = wallet.squad?.members?.length ?? 0;
        bonusAmount = totalReferrals <= 3 ? rewardSettings.referralBonusTier1 : rewardSettings.referralBonusTier2;
        claimedReferrals.push(referralId);
        claimedMessage = `You claimed your referral bonus!`;
    } else if (type === 'new_member_referral') {
        if (claimedReferrals.includes(referralId)) {
             return NextResponse.json({ error: 'Referral bonus already claimed.' }, { status: 400 });
        }
        bonusAmount = rewardSettings.newUserBonus;
        claimedReferrals.push(referralId);
        claimedMessage = `You claimed your new member bonus!`;
    }

    if (bonusAmount <= 0) {
      return NextResponse.json({ error: 'Invalid reward or bonus not configured.' }, { status: 400 });
    }
    
    const updatedWalletData = {
      ...wallet,
      balances: {
        ...wallet.balances,
        usdt: (wallet.balances.usdt || 0) + bonusAmount,
      },
      claimed_achievements: claimedAchievements,
      claimed_referrals: claimedReferrals,
    };
    
    await updateWalletByUserId(userId, updatedWalletData);
    
    await addNotification(userId, {
        title: "Reward Claimed!",
        content: `${claimedMessage} +$${bonusAmount.toFixed(2)} has been added to your balance.`,
        href: "/dashboard/rewards",
    });

    return NextResponse.json({ success: true, message: 'Reward claimed successfully.' });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
