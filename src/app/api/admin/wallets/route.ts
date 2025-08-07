
import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const wallets = await getAllWallets();
    const mappedWallets = Object.entries(wallets).map(([userId, walletData]) => ({
        ...walletData,
        user_id: userId,
    }));
    const walletsRecord = mappedWallets.reduce((acc, wallet) => {
        acc[wallet.user_id] = wallet;
        return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(walletsRecord);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
