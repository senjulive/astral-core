
import { NextResponse } from 'next/server';
import { getAllWallets } from '@/lib/wallet';
import { ranks, getUserRank } from '@/lib/ranks';

// A mock function to simulate fetching deposit/withdrawal history, as it's not in the wallet data model.
const MOCK_TRANSACTION_TOTALS: Record<string, { deposits: number; withdrawals: number }> = {
    'mock-user-123': { deposits: 500, withdrawals: 100 },
};

export async function POST(request: Request) {
  try {
    const wallets = await getAllWallets();
    if (!wallets) {
      throw new Error('Could not fetch wallet data.');
    }

    const userIds = Object.keys(wallets);
    const totalUsers = userIds.length;
    
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalGridEarnings = 0;
    let totalPendingWithdrawals = 0;
    let rankDistribution: Record<string, number> = {};
    ranks.forEach(r => rankDistribution[r.name] = 0);

    const leaderboardData = userIds.map(userId => {
        const wallet = wallets[userId];
        const transactions = MOCK_TRANSACTION_TOTALS[userId] || { deposits: 0, withdrawals: 0 };
        
        const gridEarnings = wallet.growth?.earningsHistory?.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0) || 0;
        const pendingWithdrawalAmount = wallet.pending_withdrawals?.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0) || 0;

        totalDeposits += transactions.deposits;
        totalWithdrawals += transactions.withdrawals;
        totalGridEarnings += gridEarnings;
        totalPendingWithdrawals += pendingWithdrawalAmount;
        
        const balances = wallet.balances || { usdt: 0, btc: 0, eth: 0 };
        const totalBalance = (balances.usdt ?? 0) + (balances.btc ?? 0) * 68000 + (balances.eth ?? 0) * 3500; // Using mock prices
        const userRank = getUserRank(totalBalance);
        if (rankDistribution.hasOwnProperty(userRank.name)) {
            rankDistribution[userRank.name]++;
        }

        return {
            userId,
            username: wallet.profile?.username || userId,
            balance: totalBalance,
            deposits: transactions.deposits,
            withdrawals: transactions.withdrawals,
            gridEarnings,
            rank: userRank.name,
        };
    });

    const netInflow = totalDeposits - totalWithdrawals;

    const rankChartData = Object.entries(rankDistribution)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value, fill: `var(--color-${name.toLowerCase().replace(/\s/g, '-')})` }));


    return NextResponse.json({
      totals: {
        totalUsers,
        totalDeposits,
        totalWithdrawals,
        totalGridEarnings,
        totalPendingWithdrawals,
        netInflow,
      },
      leaderboard: leaderboardData.sort((a, b) => b.balance - a.balance),
      rankChartData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
