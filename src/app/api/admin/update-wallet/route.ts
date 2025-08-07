
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const { userId, newWalletData } = await request.json();
    if (!userId || !newWalletData) {
      return NextResponse.json({ error: 'User ID and new wallet data are required' }, { status: 400 });
    }

    const currentWallet = await getWalletByUserId(userId);
    if (!currentWallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // A simple merge, in a real app you'd have more sophisticated logic
    const updatedData = { ...currentWallet, ...newWalletData };
    
    await updateWalletByUserId(userId, updatedData);

    return NextResponse.json({ success: true, message: 'Wallet updated successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
