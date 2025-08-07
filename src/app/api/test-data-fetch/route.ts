import { NextResponse } from 'next/server';
import { testDataFetching } from '@/lib/test-data-fetch';

export async function GET() {
  try {
    const result = await testDataFetching();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Test failed' },
      { status: 500 }
    );
  }
}
