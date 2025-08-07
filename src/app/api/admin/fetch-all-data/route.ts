import { NextResponse } from 'next/server';
import { fetchAllData, fetchSystemStats } from '@/lib/data-aggregator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'full';

    if (type === 'stats') {
      const stats = await fetchSystemStats();
      return NextResponse.json(stats);
    }

    const allData = await fetchAllData();
    return NextResponse.json(allData);
  } catch (error: any) {
    console.error('Error in fetch-all-data API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type } = body;

    if (userId) {
      const { fetchUserData } = await import('@/lib/data-aggregator');
      const userData = await fetchUserData(userId);
      return NextResponse.json(userData);
    }

    if (type === 'export') {
      const allData = await fetchAllData();
      
      // Format for export (could be CSV, Excel, etc.)
      const exportData = {
        timestamp: new Date().toISOString(),
        summary: {
          totalUsers: allData.users.totalUsers,
          totalBalance: allData.users.analytics.leaderboard.reduce((sum, user) => sum + user.balance, 0),
          totalDeposits: allData.users.analytics.totalDeposits,
          totalWithdrawals: allData.users.analytics.totalWithdrawals,
          netInflow: allData.users.analytics.netInflow,
        },
        users: allData.users.profiles.map(profile => ({
          userId: profile.userId,
          username: profile.username,
          fullName: profile.fullName,
          country: profile.country,
          verificationStatus: profile.verificationStatus,
          balance: allData.users.wallets[profile.userId]?.balances,
          rank: allData.users.analytics.leaderboard.find(u => u.userId === profile.userId)?.rank,
        })),
        systemSettings: allData.settings,
      };

      return NextResponse.json(exportData);
    }

    const allData = await fetchAllData();
    return NextResponse.json(allData);
  } catch (error: any) {
    console.error('Error in fetch-all-data POST API:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
