
import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const allWallets = await getAllWallets();
    
    const allPendingWithdrawals = Object.entries(allWallets)
      .filter(([, wallet]) => wallet.pending_withdrawals && wallet.pending_withdrawals.length > 0)
      .flatMap(([userId, wallet]) => 
        wallet.pending_withdrawals.map((withdrawal: any) => ({
          ...withdrawal,
          userId,
          username: wallet.profile?.username || userId,
        }))
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()); // oldest first

    return NextResponse.json(allPendingWithdrawals);
  } catch (error: any) {
    console.error('API Error in /api/admin/pending-withdrawals:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
