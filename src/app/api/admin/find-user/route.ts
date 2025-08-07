
import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';

// NOTE: This is a mock implementation. In a real application,
// you would have a more efficient way to look up users by email from a database.
// The mock user data does not store emails with wallets, so we are using a hardcoded map.
const MOCK_EMAIL_TO_ID_MAP: Record<string, string> = {
    'user@example.com': 'mock-user-123',
    'another@example.com': 'mock-user-456',
};


export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    
    const userId = MOCK_EMAIL_TO_ID_MAP[email.toLowerCase()];

    if (!userId) {
         return NextResponse.json({ error: 'User with that email not found.' }, { status: 404 });
    }

    const allWallets = await getAllWallets();
    const wallet = allWallets[userId];

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet for that user not found.' }, { status: 404 });
    }

    // Return the wallet data along with the user ID
    return NextResponse.json({ ...wallet, user_id: userId });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
