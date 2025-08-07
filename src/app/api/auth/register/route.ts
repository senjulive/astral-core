import { NextResponse } from 'next/server';
import { register } from '@/lib/auth-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, fullName, phoneNumber, country } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!fullName) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      );
    }

    const result = await register({ 
      email, 
      password,
      fullName,
      phoneNumber,
      country 
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // In a real app, you would send a verification email here
    const response = NextResponse.json({
      success: true,
      message: 'Registration successful! Please check your email for verification instructions.',
      requiresVerification: true
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
