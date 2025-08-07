
import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ...profileData } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedWalletData = {
      ...wallet,
      verification_status: 'verifying',
      profile: {
        ...wallet.profile,
        ...profileData,
        verificationStatus: 'verifying',
      },
    };
    
    await updateWalletByUserId(userId, updatedWalletData);

    return NextResponse.json({ success: true, message: 'Profile submitted for verification.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
