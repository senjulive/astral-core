import { NextResponse } from 'next/server';
import { getWalletByUserId, updateWalletByUserId } from '@/lib/wallet';
import { addNotification } from '@/lib/notifications';
import { logModeratorAction } from '@/lib/moderator';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const wallet = await getWalletByUserId(userId);
    if (!wallet) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update wallet data
    const updatedWalletData = {
      ...wallet,
      verification_status: 'verified',
      profile: {
        ...wallet.profile,
        verificationStatus: 'verified',
      },
    };
    
    await updateWalletByUserId(userId, updatedWalletData);

    // Notify the user
    await addNotification(userId, {
      title: 'Verification Complete',
      content: 'Your identity verification has been approved. You now have full access to the platform.',
      href: '/dashboard/profile',
    });

    // Log the action
    await logModeratorAction(`Manually approved verification for user ${wallet.profile.username || userId}.`);

    return NextResponse.json({ message: 'User verified successfully' });
  } catch (error: any) {
    console.error('API Error in /api/admin/verify-user:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
