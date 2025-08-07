
import { NextResponse } from 'next/server';
import { clearNotifications } from '@/lib/notifications';

const MOCK_USER_ID = 'mock-user-123';

export async function POST(request: Request) {
  try {
    // In a real app, you would get the user ID from the session.
    await clearNotifications(MOCK_USER_ID);
    return NextResponse.json({ success: true, message: 'Notifications cleared.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
