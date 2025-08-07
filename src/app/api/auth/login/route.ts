import { NextResponse } from 'next/server';
import { login } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    // Ensure we can read the body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await login({ email, password });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // In a real app, you would set secure HTTP-only cookies here
    const response = NextResponse.json({
      success: true,
      role: result.role,
      message: 'Login successful'
    });

    // Set mock session cookie
    response.cookies.set('astralcore-session', JSON.stringify({
      email,
      role: result.role,
      timestamp: Date.now()
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
