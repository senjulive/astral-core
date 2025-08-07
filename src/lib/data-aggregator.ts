import { getAllWallets } from './wallet';
import { getAllNotifications } from './notifications';
import { getPublicChatMessages } from './chat-server';
import { getAllSquadClans } from './squad-clans';
import { getBotTierSettings } from './tiers';
import { ranks, getUserRank } from './ranks';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface AggregatedData {
  users: {
    totalUsers: number;
    wallets: Record<string, any>;
    profiles: any[];
    analytics: {
      totalDeposits: number;
      totalWithdrawals: number;
      totalGridEarnings: number;
      totalPendingWithdrawals: number;
      netInflow: number;
      rankDistribution: Record<string, number>;
      leaderboard: any[];
    };
  };
  settings: {
    botSettings: any;
    botTierSettings: any[];
    siteSettings: any;
  };
  communications: {
    notifications: Record<string, any[]>;
    chats: Record<string, any[]>;
    publicChat: any[];
    squadChats: Record<string, any>;
    squadClans: Record<string, any>;
  };
  metadata: {
    fetchedAt: string;
    dataVersion: string;
  };
}

const MOCK_TRANSACTION_TOTALS: Record<string, { deposits: number; withdrawals: number }> = {
  'mock-user-123': { deposits: 500, withdrawals: 100 },
};

async function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const data = await fs.readFile(fullPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not read file ${filePath}:`, error);
    return {};
  }
}

export async function fetchAllData(): Promise<AggregatedData> {
  try {
    // Fetch wallet and user data
    const wallets = await getAllWallets();
    const userIds = Object.keys(wallets);

    // Calculate analytics
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
      const pendingWithdrawalAmount = wallet.pendingWithdrawals?.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0) || 0;

      totalDeposits += transactions.deposits;
      totalWithdrawals += transactions.withdrawals;
      totalGridEarnings += gridEarnings;
      totalPendingWithdrawals += pendingWithdrawalAmount;
      
      const balances = wallet.balances || { usdt: 0, btc: 0, eth: 0 };
      const totalBalance = (balances.usdt ?? 0) + (balances.btc ?? 0) * 68000 + (balances.eth ?? 0) * 3500;
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
        profile: wallet.profile,
        growth: wallet.growth,
        squad: wallet.squad,
        security: wallet.security,
      };
    });

    // Fetch communications data
    const notifications = await getAllNotifications();
    const publicChat = await getPublicChatMessages();
    const squadClans = await getAllSquadClans();

    // Fetch settings
    const botSettings = await readJsonFile('data/settings.json');
    const botTierSettings = getBotTierSettings();
    const chatsData = await readJsonFile('data/chats.json');
    const squadChatsData = await readJsonFile('src/data/squad-chats.json');

    // Extract profiles
    const profiles = userIds.map(userId => ({
      userId,
      ...wallets[userId].profile,
      verificationStatus: wallets[userId].profile?.verificationStatus || 'unverified',
      squad: wallets[userId].squad,
    }));

    const aggregatedData: AggregatedData = {
      users: {
        totalUsers: userIds.length,
        wallets,
        profiles,
        analytics: {
          totalDeposits,
          totalWithdrawals,
          totalGridEarnings,
          totalPendingWithdrawals,
          netInflow: totalDeposits - totalWithdrawals,
          rankDistribution,
          leaderboard: leaderboardData.sort((a, b) => b.balance - a.balance),
        },
      },
      settings: {
        botSettings,
        botTierSettings,
        siteSettings: {}, // Add site settings if needed
      },
      communications: {
        notifications,
        chats: chatsData,
        publicChat,
        squadChats: squadChatsData,
        squadClans,
      },
      metadata: {
        fetchedAt: new Date().toISOString(),
        dataVersion: '1.0.0',
      },
    };

    return aggregatedData;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw new Error(`Failed to fetch all data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchUserData(userId: string) {
  const allData = await fetchAllData();
  return {
    user: allData.users.wallets[userId] || null,
    profile: allData.users.profiles.find(p => p.userId === userId) || null,
    notifications: allData.communications.notifications[userId] || [],
    chats: allData.communications.chats[userId] || [],
    analytics: allData.users.analytics.leaderboard.find(u => u.userId === userId) || null,
  };
}

export async function fetchSystemStats() {
  const allData = await fetchAllData();
  return {
    totalUsers: allData.users.totalUsers,
    analytics: allData.users.analytics,
    settings: allData.settings,
    publicChatMessageCount: allData.communications.publicChat.length,
    totalNotifications: Object.values(allData.communications.notifications).flat().length,
    metadata: allData.metadata,
  };
}
