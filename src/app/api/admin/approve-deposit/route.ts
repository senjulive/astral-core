
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const { userId, depositId, amount, asset } = await request.json();
    if (!userId || !depositId || !amount || !asset) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Filter out the approved deposit request
    const updatedPendingDeposits = (wallet.pending_deposits || []).filter(
      (req: any) => req.id !== depositId
    );

    // Update the balance
    const updatedBalances = {
      ...wallet.balances,
      [asset.toLowerCase()]: (wallet.balances[asset.toLowerCase()] || 0) + parseFloat(amount),
    };

    const updatedWalletData = {
      ...wallet,
      balances: updatedBalances,
      pending_deposits: updatedPendingDeposits,
    };
    
    await updateWalletByUserId(userId, updatedWalletData);

    await addNotification(userId, {
      title: 'Deposit Approved',
      content: `Your deposit of ${amount} ${asset.toUpperCase()} has been approved and credited to your account.`,
      href: '/dashboard/deposit',
    });

    return NextResponse.json({ message: 'Deposit approved and user credited successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
