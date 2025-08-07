
'use client';

import * as React from 'react';
import type { SVGProps } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AnalyticsData } from './AnalyticsManager';
import { Badge } from '@/components/ui/badge';
import { getUserRank } from '@/lib/ranks';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';


type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Lock,
};


export function UserLeaderboard({ data }: { data: AnalyticsData }) {
    const { leaderboard } = data;

    const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Leaderboard</CardTitle>
                <CardDescription>An overview of all users, sorted by their total balance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead className="text-right">Balance</TableHead>
                            <TableHead className="text-right">Deposits</TableHead>
                            <TableHead className="text-right">Withdrawals</TableHead>
                            <TableHead className="text-right">Grid Earnings</TableHead>
                            <TableHead>Account Rank</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((user, index) => {
                             const rankInfo = getUserRank(user.balance);
                             const RankIcon = rankIcons[rankInfo.Icon] || RecruitRankIcon;
                             return (
                                <TableRow key={user.userId}>
                                    <TableCell className="font-bold">#{index + 1}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell className="text-right font-mono">{formatCurrency(user.balance)}</TableCell>
                                    <TableCell className="text-right font-mono text-green-600">{formatCurrency(user.deposits)}</TableCell>
                                    <TableCell className="text-right font-mono text-red-600">{formatCurrency(user.withdrawals)}</TableCell>
                                    <TableCell className="text-right font-mono text-blue-600">{formatCurrency(user.gridEarnings)}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("text-base py-1 px-2 flex items-center gap-1.5 w-fit", rankInfo.className)}>
                                            <RankIcon className="h-4 w-4" />
                                            <span>{rankInfo.name}</span>
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                             )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
