'use client';

import type { SVGProps } from 'react';
import { RecruitTierIcon } from '@/components/icons/tiers/recruit-tier-icon';
import { BronzeTierIcon } from '@/components/icons/tiers/bronze-tier-icon';
import { SilverTierIcon } from '@/components/icons/tiers/silver-tier-icon';
import { GoldTierIcon } from '@/components/icons/tiers/gold-tier-icon';
import { PlatinumTierIcon } from '@/components/icons/tiers/platinum-tier-icon';
import { DiamondTierIcon } from '@/components/icons/tiers/diamond-tier-icon';
import { Lock } from 'lucide-react';
import type { TierSetting as TierSettingData } from '@/lib/tiers';

export const tierIcons: { [key: string]: (props: SVGProps<SVGSVGElement>) => JSX.Element } = {
    'tier-1': RecruitTierIcon,
    'tier-2': BronzeTierIcon,
    'tier-3': SilverTierIcon,
    'tier-4': GoldTierIcon,
    'tier-5': PlatinumTierIcon,
    'tier-6': DiamondTierIcon,
    'tier-7': Lock,
    'tier-8': Lock,
};

export const tierClassNames: { [key: string]: string } = {
    'tier-1': 'text-muted-foreground',
    'tier-2': 'text-orange-600',
    'tier-3': 'text-slate-400',
    'tier-4': 'text-amber-500',
    'tier-5': 'text-sky-400',
    'tier-6': 'text-purple-400',
    'tier-7': 'text-muted-foreground',
    'tier-8': 'text-muted-foreground',
};

export type TierSetting = TierSettingData & {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className: string;
};
