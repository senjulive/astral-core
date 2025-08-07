
import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const allWallets = await getAllWallets();
    
    const allPendingDeposits = Object.entries(allWallets)
      .filter(([, wallet]) => wallet.pending_deposits && wallet.pending_deposits.length > 0)
      .flatMap(([userId, wallet]) => 
        wallet.pending_deposits.map((deposit: any) => ({
          ...deposit,
          userId,
          username: wallet.profile?.username || userId,
        }))
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(allPendingDeposits);
  } catch (error: any) {
    console.error('API Error in /api/admin/pending-deposits:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
