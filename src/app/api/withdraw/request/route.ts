
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';
import { logModeratorAction } from '@/lib/moderator';

export async function POST(request: Request) {
  try {
    const { userId, amount, asset, address } = await request.json();
    if (!userId || !amount || !asset || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
        return NextResponse.json({ error: 'User wallet not found.' }, { status: 404 });
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal amount.' }, { status: 400 });
    }

    if (wallet.balances[asset.toLowerCase()] < withdrawAmount) {
      return NextResponse.json({ error: 'Insufficient balance.' }, { status: 400 });
    }

    const newWithdrawalRequest = {
        id: `wd_${crypto.randomUUID()}`,
        amount: withdrawAmount,
        asset,
        address,
        timestamp: new Date().toISOString(),
        status: 'pending',
    };
    
    const updatedWalletData = {
        ...wallet,
        balances: {
          ...wallet.balances,
          [asset.toLowerCase()]: wallet.balances[asset.toLowerCase()] - withdrawAmount,
        },
        pending_withdrawals: [...(wallet.pending_withdrawals || []), newWithdrawalRequest],
    };
    
    await updateWalletByUserId(userId, updatedWalletData);
    
    await addNotification(userId, {
        title: "Withdrawal Request Received",
        content: `Your request to withdraw ${amount} ${asset.toUpperCase()} is pending approval.`,
        href: "/dashboard/withdraw",
    });

    // Notify admins/mods
    await logModeratorAction(
        `New withdrawal request from ${wallet.profile.username || userId} for ${amount} ${asset.toUpperCase()}.`
    );

    return NextResponse.json({ success: true, message: 'Withdrawal request submitted successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
