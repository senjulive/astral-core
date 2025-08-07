
import { NextResponse } from 'next/server';

// In a real application, you would interact with your database (e.g., Builder.io models)
// to clear the withdrawal address for the given userId.

// This is a placeholder function to simulate the database operation.
async function clearUserWithdrawalAddress(userId: string) {
  console.log(`Simulating clearing withdrawal address for user: ${userId}`);
  // Here, you would implement the actual logic to update your Builder.io userWallets model
  // by setting the withdrawal address field for this user to null or an empty string.
  // Example: Builder.io.update('userWallets', { query: { userId: userId }, data: { withdrawalAddress: null } })
  return { success: true, message: `Withdrawal address for user ${userId} has been reset.` };
}

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const result = await clearUserWithdrawalAddress(userId);

    if (result.success) {
      return NextResponse.json({ message: result.message });
    } else {
      throw new Error(result.message || 'Failed to reset withdrawal address.');
    }
  } catch (error: any) {
    console.error('Error resetting withdrawal address:', error);
    return NextResponse.json({ error: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
