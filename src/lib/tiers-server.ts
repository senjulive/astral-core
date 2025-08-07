import * as fs from 'fs/promises';
import * as path from 'path';
import type { TierSetting } from './tiers';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');

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

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function getBotTierSettingsServer(): Promise<TierSetting[]> {
    try {
        const settings = await readSettings();
        const tierSettings = settings['botTierSettings'];
        if (tierSettings && Array.isArray(tierSettings) && tierSettings.length > 0) {
            return tierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
        }
    } catch (error) {
        console.error("Could not read tier settings from file, using defaults.", error);
    }
    return defaultTierSettings.sort((a, b) => a.balanceThreshold - b.balanceThreshold);
}
