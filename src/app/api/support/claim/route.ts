
import { NextResponse } from 'next/server';

// In-memory store for mock claim status
let claimStore: Record<string, any> = {};

export async function GET() {
    return NextResponse.json(claimStore);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { supportUserId, action } = body;
        const MOCK_MODERATOR = { id: 'mock-moderator-id', username: 'ModUser' };

        if (action === 'claim') {
            claimStore[supportUserId] = {
                user_id: supportUserId,
                handler_id: MOCK_MODERATOR.id,
                handler: { username: MOCK_MODERATOR.username },
            };
        } else if (action === 'unclaim') {
            delete claimStore[supportUserId];
        }

        return NextResponse.json(claimStore[supportUserId] || null);

    } catch (error: any) {
        return NextResponse.json({ error: 'Failed to update claim status' }, { status: 500 });
    }
}
