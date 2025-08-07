
import { analyzeSupportThread, type SupportAgentInput } from '@/ai/flows/support-agent-flow';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as SupportAgentInput;
    const result = await analyzeSupportThread(input);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
