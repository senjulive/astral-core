import * as fs from 'fs/promises';
import * as path from 'path';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');

const defaultRewardSettings = {
  rankAchievementBonus: 10,
  tierAchievementBonus: 5,
  referralBonusTier1: 5,
  referralBonusTier2: 1,
  newUserBonus: 5,
};

async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export async function getRewardSettings() {
    try {
        const settings = await readSettings();
        return settings['rewardSettings'] || defaultRewardSettings;
    } catch (error) {
        console.error("Could not read reward settings from file, using defaults.", error);
    }
    return defaultRewardSettings;
}
