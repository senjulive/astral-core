import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('astralcore-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    try {
      const session = JSON.parse(sessionCookie.value);
      
      // Check if session is expired (7 days)
      const maxAge = 60 * 60 * 24 * 7 * 1000; // 7 days in milliseconds
      if (Date.now() - session.timestamp > maxAge) {
        // Clear expired session cookie
        const response = NextResponse.json(
          { authenticated: false, user: null },
          { status: 200 }
        );
        response.cookies.delete('astralcore-session');
        return response;
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          email: session.email,
          role: session.role
        }
      });
    } catch (parseError) {
      // Clear invalid session cookie
      const response = NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
      response.cookies.delete('astralcore-session');
      return response;
    }
  } catch (error: any) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
