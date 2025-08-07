
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';
import { logModeratorAction } from '@/lib/moderator'; // Assuming an admin notification function exists here

export async function POST(request: Request) {
  try {
    const { userId, amount, asset } = await request.json();
    if (!userId || !amount || !asset) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
        return NextResponse.json({ error: 'User wallet not found.' }, { status: 404 });
    }

    const newDepositRequest = {
        id: `dep_${crypto.randomUUID()}`,
        amount: parseFloat(amount),
        asset,
        timestamp: new Date().toISOString(),
        status: 'pending',
    };
    
    const updatedWalletData = {
        ...wallet,
        pending_deposits: [...(wallet.pending_deposits || []), newDepositRequest],
    };
    
    await updateWalletByUserId(userId, updatedWalletData);
    
    await addNotification(userId, {
        title: "Deposit Request Received",
        content: `Your request to deposit ${amount} ${asset.toUpperCase()} is pending approval.`,
        href: "/dashboard/deposit",
    });

    // Notify admins/mods
    await logModeratorAction(
        `New deposit request from ${wallet.profile.username || userId} for ${amount} ${asset.toUpperCase()}.`
    );

    return NextResponse.json({ success: true, message: 'Deposit request submitted successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
