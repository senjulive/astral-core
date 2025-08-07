import type { SVGProps } from 'react';
import type { TierSetting } from './tiers';

export type Rank = {
  name: string;
  minBalance: number;
  Icon: string; // Now a string identifier
  className: string;
};

export const ranks: Rank[] = [
  { name: 'Recruit', minBalance: 100, Icon: 'RecruitRankIcon', className: 'text-muted-foreground' },
  { name: 'Bronze', minBalance: 500, Icon: 'BronzeRankIcon', className: 'text-orange-600' },
  { name: 'Silver', minBalance: 1000, Icon: 'SilverRankIcon', className: 'text-slate-400' },
  { name: 'Gold', minBalance: 5000, Icon: 'GoldRankIcon', className: 'text-amber-500' },
  { name: 'Platinum', minBalance: 10000, Icon: 'PlatinumRankIcon', className: 'text-sky-400' },
  { name: 'Diamond', minBalance: 15000, Icon: 'DiamondRankIcon', className: 'text-purple-400' },
  { name: 'Astral', minBalance: 50000, Icon: 'Lock', className: 'text-muted-foreground' },
  { name: 'Cosmic', minBalance: 100000, Icon: 'Lock', className: 'text-muted-foreground' },
];

export const getUserRank = (balance: number): Rank => {
  const sortedRanks = [...ranks].sort((a, b) => b.minBalance - a.minBalance);
  // Exclude locked ranks from being assigned to a user for now.
  return sortedRanks.find(rank => balance >= rank.minBalance && rank.Icon !== 'Lock') || ranks[0];
};
