
'use client';

import * as React from 'react';
import type { WalletData } from '@/lib/wallet';
import type { Rank } from '@/lib/ranks';
import type { TierSetting as TierData } from '@/lib/tiers';

// A generic user type for when Supabase is removed.
type User = {
    id: string;
    email: string;
    // Add other user properties as needed
};

type UserContextType = {
    user: User | null;
    wallet: WalletData | null;
    rank: Rank | null;
    tier: TierData | null;
    tierSettings: TierData[];
};

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, value }: { children: React.ReactNode; value: UserContextType }) => {
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
