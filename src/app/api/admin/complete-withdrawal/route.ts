
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';
import { logModeratorAction } from '@/lib/moderator';

export async function POST(request: Request) {
  try {
    const { userId, withdrawalId } = await request.json();
    if (!userId || !withdrawalId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const withdrawal = (wallet.pending_withdrawals || []).find((req: any) => req.id === withdrawalId);
    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    // Filter out the completed withdrawal request
    const updatedPendingWithdrawals = (wallet.pending_withdrawals || []).filter(
      (req: any) => req.id !== withdrawalId
    );
    
    const updatedWalletData = {
      ...wallet,
      pending_withdrawals: updatedPendingWithdrawals,
    };
    
    await updateWalletByUserId(userId, updatedWalletData);

    await addNotification(userId, {
      title: 'Withdrawal Successful',
      content: `Your withdrawal of ${withdrawal.amount.toFixed(2)} ${withdrawal.asset.toUpperCase()} has been successfully processed.`,
      href: '/dashboard/withdraw',
    });

    await logModeratorAction(`Completed withdrawal of ${withdrawal.amount.toFixed(2)} for user ${wallet.profile.username || userId}.`);

    return NextResponse.json({ message: 'Withdrawal completed successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
