// Client-safe module for tier data and logic.
// Contains types and client-side utilities only.

export type TierSetting = {
  id: string; // e.g., 'tier-1'
  name: string;
  balanceThreshold: number;
  dailyProfit: number; // as a decimal, e.g., 0.02 for 2%
  clicks: number;
  locked: boolean;
};

const defaultTierSettings: TierSetting[] = [
  { id: 'tier-1', name: 'VIP CORE I', balanceThreshold: 100, dailyProfit: 0.02, clicks: 4, locked: false },
  { id: 'tier-2', name: 'VIP CORE II', balanceThreshold: 500, dailyProfit: 0.03, clicks: 5, locked: false },
  { id: 'tier-3', name: 'VIP CORE III', balanceThreshold: 1000, dailyProfit: 0.04, clicks: 6, locked: false },
  { id: 'tier-4', name: 'VIP CORE IV', balanceThreshold: 5000, dailyProfit: 0.055, clicks: 7, locked: false },
  { id: 'tier-5', name: 'VIP CORE V', balanceThreshold: 10000, dailyProfit: 0.065, clicks: 8, locked: false },
  { id: 'tier-6', name: 'VIP CORE VI', balanceThreshold: 15000, dailyProfit: 0.085, clicks: 10, locked: false },
  { id: 'tier-7', name: 'VIP CORE VII', balanceThreshold: 50000, dailyProfit: 0.1, clicks: 12, locked: true },
  { id: 'tier-8', name: 'VIP CORE VIII', balanceThreshold: 100000, dailyProfit: 0.12, clicks: 15, locked: true },
];

// Client-safe function to get tier settings
export function getBotTierSettings(): TierSetting[] {
    return defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}

// Client-safe function to get current tier based on balance
export function getCurrentTier(balance: number, tiers?: TierSetting[]): TierSetting | null {
    const tierList = tiers || defaultTierSettings;
    const applicableTier = [...tierList].reverse().find(
        tier => balance >= tier.balanceThreshold && !tier.locked
    );
    return applicableTier || tierList.find(t => !t.locked) || null;
}
