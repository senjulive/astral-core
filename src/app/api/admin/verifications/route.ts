import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const allWallets = await getAllWallets();
    
    // Filter for wallets that have a verification status of "verifying"
    const pendingVerifications = Object.entries(allWallets)
      .filter(([, wallet]) => wallet.verification_status === 'verifying' && wallet.profile?.id_card_front_url)
      .map(([userId, wallet]) => ({
        ...wallet,
        user_id: userId, // Ensure user_id is in the object
      }));

    return NextResponse.json(pendingVerifications);
  } catch (error: any) {
    console.error('API Error in /api/admin/verifications:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
