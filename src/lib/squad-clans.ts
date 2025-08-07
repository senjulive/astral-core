'use server';

import * as fs from 'fs/promises';
import * as path from 'path';
import { getAllWallets, getWalletByUserId } from './wallet';
import { type Rank } from './ranks';
import { type TierSetting } from './tiers';
import { getBotTierSettingsServer } from './tiers-server';

const CLANS_FILE_PATH = path.join(process.cwd(), 'data', 'squad-clans.json');
const CHATS_FILE_PATH = path.join(process.cwd(), 'data', 'squad-chats.json');

export type Clan = {
    id: string;
    name: string;
    avatarUrl: string;
    leaderId: string;
    members: string[]; // array of user IDs
};

export type ClanChatMessage = {
    id: string;
    clanId: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierSetting | null;
};

async function readClans(): Promise<Record<string, Clan>> {
    try {
        const data = await fs.readFile(CLANS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function writeClans(data: Record<string, Clan>): Promise<void> {
    await fs.writeFile(CLANS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function readChats(): Promise<Record<string, ClanChatMessage[]>> {
    try {
        const data = await fs.readFile(CHATS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

async function writeChats(data: Record<string, ClanChatMessage[]>): Promise<void> {
    await fs.writeFile(CHATS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function getMinClanCreateBalance(): Promise<number> {
    const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'settings.json');
    try {
        const data = await fs.readFile(SETTINGS_FILE_PATH, 'utf-8');
        const settings = JSON.parse(data);
        return settings?.botSettings?.minClanCreateBalance || 100;
    } catch {
        return 100;
    }
}

export async function createClan(leaderId: string, name: string, avatarUrl: string): Promise<Clan | null> {
    const leaderWallet = await getWalletByUserId(leaderId);
    if (!leaderWallet) return null;

    const allWallets = await getAllWallets();
    const squadMembers = leaderWallet.squad?.members || [];
    
    // Check if the leader already has a clan
    const allClans = await readClans();
    const existingClan = Object.values(allClans).find(c => c.leaderId === leaderId);
    if (existingClan) {
        throw new Error("Leader has already created a clan.");
    }
    
    const minBalance = await getMinClanCreateBalance();
    
    const verifiedMembersWithBalance = squadMembers.filter((memberId: string) => {
        const memberWallet = allWallets[memberId];
        return memberWallet?.verification_status === 'verified' && memberWallet?.balances?.usdt >= minBalance;
    });

    if (verifiedMembersWithBalance.length < 5) {
        return null; // Not enough members meeting criteria
    }

    const newClan: Clan = {
        id: `clan_${crypto.randomUUID()}`,
        name,
        avatarUrl,
        leaderId,
        members: [leaderId, ...squadMembers],
    };

    allClans[newClan.id] = newClan;
    await writeClans(allClans);

    return newClan;
}

export async function getClanForUser(userId: string): Promise<Clan | null> {
    const clans = await readClans();
    return Object.values(clans).find(clan => clan.members.includes(userId)) || null;
}

export async function getClanById(clanId: string): Promise<Clan | null> {
    const clans = await readClans();
    return clans[clanId] || null;
}

export async function addClanMessage(clanId: string, messageData: Omit<ClanChatMessage, 'id' | 'clanId' | 'timestamp'>): Promise<void> {
    const allChats = await readChats();
    if (!allChats[clanId]) {
        allChats[clanId] = [];
    }
    
    const newMessage: ClanChatMessage = {
        ...messageData,
        id: `cmsg_${crypto.randomUUID()}`,
        clanId,
        timestamp: Date.now(),
    };

    allChats[clanId].push(newMessage);
    await writeChats(allChats);
}

export async function getClanMessages(clanId: string): Promise<ClanChatMessage[]> {
    const allChats = await readChats();
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    const clanMessages = allChats[clanId] || [];

    // Filter out old messages
    const recentMessages = clanMessages.filter(msg => msg.timestamp >= twentyFourHoursAgo);

    if (recentMessages.length < clanMessages.length) {
        allChats[clanId] = recentMessages;
        await writeChats(allChats); // Clean up the old messages from the file
    }

    return recentMessages;
}

export async function getAllSquadClans(): Promise<Record<string, Clan>> {
    return await readClans();
}
