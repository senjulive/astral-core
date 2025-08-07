import { NextResponse } from 'next/server';
import { verifyToken, updateUser, getUserById } from '@/lib/auth-server';
import { headers } from 'next/headers';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    const tokenResult = await verifyToken(token);

    if (tokenResult.error) {
      return NextResponse.json(
        { error: tokenResult.error },
        { status: 401 }
      );
    }

    const user = await getUserById(tokenResult.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove sensitive data
    const { password, verificationCode, resetPasswordCode, ...userProfile } = user;

    return NextResponse.json({
      success: true,
      user: userProfile
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authorization.slice(7);
    const tokenResult = await verifyToken(token);

    if (tokenResult.error) {
      return NextResponse.json(
        { error: tokenResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { fullName, phoneNumber, country } = body;

    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (phoneNumber) updates.phoneNumber = phoneNumber;
    if (country) updates.country = country;

    const result = await updateUser(tokenResult.user.id, updates);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Remove sensitive data
    const { password, verificationCode, resetPasswordCode, ...userProfile } = result.user;

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userProfile
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
