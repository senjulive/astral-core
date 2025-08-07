
import { summarizeMarket, type MarketSummaryInput } from '@/ai/flows/market-summary-flow';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as MarketSummaryInput;
    const result = await summarizeMarket(input);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
