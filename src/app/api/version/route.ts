import { NextResponse } from 'next/server';

export async function GET() {
  const version = {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'AstralCore',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '5.0',
    environment: process.env.NODE_ENV || 'development',
    buildTime: new Date().toISOString(),
    features: {
      trading: process.env.NEXT_PUBLIC_ENABLE_TRADING === 'true',
      deposits: process.env.NEXT_PUBLIC_ENABLE_DEPOSITS === 'true',
      withdrawals: process.env.NEXT_PUBLIC_ENABLE_WITHDRAWALS === 'true',
      chat: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true'
    }
  };

  return NextResponse.json(version);
}
