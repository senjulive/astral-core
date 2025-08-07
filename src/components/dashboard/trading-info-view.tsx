"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank, ranks } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type TierSetting as TierSettingData, getBotTierSettings } from "@/lib/tiers";
import { tierIcons, tierClassNames } from '@/lib/settings';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Trophy,
  User,
  ShieldCheck,
  Target,
  Award,
  CreditCard,
  History,
  Plus,
  Shield,
  Coins,
  Network,
  Gem,
  Lock,
  Unlock,
  Rocket,
  Star,
  Crown,
  Activity,
  BarChart3
} from "lucide-react";
import { format } from 'date-fns';

// Import rank icons
import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import type { SVGProps } from 'react';

type IconComponent = (props: SVGProps<SVGSVGElement>) => JSX.Element;

const rankIcons: Record<string, IconComponent> = {
    RecruitRankIcon,
    BronzeRankIcon,
    SilverRankIcon,
    GoldRankIcon,
    PlatinumRankIcon,
    DiamondRankIcon,
    Brain,
};

type TierSetting = TierSettingData & {
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  className: string;
};

export function TradingInfoView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [tierSettings, setTierSettings] = React.useState<TierSetting[]>([]);
  const [currentTab, setCurrentTab] = React.useState<"tiers" | "earnings" | "ranks">("tiers");

  const { user } = useUser();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const settingsData = getBotTierSettings();
        
        if (settingsData) {
          const settingsWithComponents = settingsData.map((tier: TierSettingData) => ({
            ...tier,
            Icon: tierIcons[tier.id] || tierIcons['tier-1'],
            className: tierClassNames[tier.id] || 'text-muted-foreground',
          }));
          setTierSettings(settingsWithComponents);
        }
      } catch (error) {
        console.error(error);
        setTierSettings([]);
      }
    }
    fetchSettings();
  }, []);

  const calculateEarnings = (balance: number, dailyProfit: number, days: number) => {
    const dailyEarning = balance * dailyProfit;
    return dailyEarning * days;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalBalance = wallet?.balances?.usdt ?? 0;
  const rank = getUserRank(totalBalance);
  const RankIcon = rankIcons[rank.Icon] || Brain;
  const currentTier = tierSettings.find(t => totalBalance >= t.balanceThreshold && !t.locked) || tierSettings[0];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Hyperdrive Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-cyan-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-500/30 to-blue-500/20 text-cyan-400 font-bold text-lg backdrop-blur-xl">
                    <Brain className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    AstralCore Hyperdrive
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Neural trading tiers, quantum ranks & profit matrices</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    {rank.name} Rank
                  </Badge>
                  {currentTier && (
                    <Badge variant="outline" className="text-xs border-cyan-400/40 text-cyan-300 bg-cyan-400/10">
                      <Gem className="h-3 w-3 mr-1" />
                      {currentTier.name} Tier
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "earnings" ? "tiers" : "earnings")}
                className="flex-1 sm:flex-none"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Earnings
              </Button>
              <Button
                size="sm"
                asChild
                className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <Link href="/dashboard/trading">
                  <Rocket className="h-4 w-4 mr-2" />
                  Activate
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 p-2 rounded-lg border border-cyan-400/30">
                <Brain className="h-5 w-5 mx-auto text-cyan-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-cyan-400">${totalBalance}</p>
            <p className="text-xs text-gray-400">Balance</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Gem className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">{currentTier?.name || 'Basic'}</p>
            <p className="text-xs text-gray-400">Tier</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Trophy className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{rank.name}</p>
            <p className="text-xs text-gray-400">Rank</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <TrendingUp className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">
              {currentTier ? `${(currentTier.dailyProfit * 100).toFixed(1)}%` : '0%'}
            </p>
            <p className="text-xs text-gray-400">Daily Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("tiers")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "tiers"
              ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/40 text-cyan-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Gem className="h-4 w-4 inline mr-2" />
          Tiers
        </button>
        <button
          onClick={() => setCurrentTab("earnings")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "earnings"
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-400/40 text-green-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <TrendingUp className="h-4 w-4 inline mr-2" />
          Earnings
        </button>
        <button
          onClick={() => setCurrentTab("ranks")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "ranks"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Trophy className="h-4 w-4 inline mr-2" />
          Ranks
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === "tiers" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Gem className="h-5 w-5 text-blue-400" />
              Neural Trading Tiers
            </CardTitle>
            <CardDescription>
              Your profit potential is directly linked to your hyperdrive tier, determined by total balance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Tier Name</TableHead>
                    <TableHead className="text-right text-gray-300">Min. Balance</TableHead>
                    <TableHead className="text-right text-gray-300">Daily Grids</TableHead>
                    <TableHead className="text-right text-gray-300">Profit Rate</TableHead>
                    <TableHead className="text-right text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tierSettings.map((tier) => (
                    <TableRow key={tier.id} className="border-border/40">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <tier.Icon className="h-5 w-5" />
                          <span className={cn("text-white", tier.className)}>{tier.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-300">
                        ${tier.balanceThreshold.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-gray-300">
                        {tier.clicks}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ~{(tier.dailyProfit * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        {tier.locked ? (
                          <Badge variant="outline" className="border-red-400/40 text-red-300 bg-red-400/10">
                            <Lock className="mr-1 h-3 w-3"/>
                            Locked
                          </Badge>
                        ) : totalBalance >= tier.balanceThreshold ? (
                          <Badge variant="outline" className="border-green-400/40 text-green-300 bg-green-400/10">
                            <Unlock className="mr-1 h-3 w-3" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-gray-400/40 text-gray-300 bg-gray-400/10">
                            <Target className="mr-1 h-3 w-3" />
                            Available
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg backdrop-blur-xl">
              <div className="flex gap-3">
                <Brain className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-300">Neural Trading Protocol</p>
                  <p className="text-sm text-blue-200">
                    Higher tiers unlock more daily grid trades and increased profit rates. The quantum AI optimizes your portfolio automatically as you advance through the hyperdrive tiers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "earnings" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Quantum Earnings Projections
            </CardTitle>
            <CardDescription>
              Estimated earnings based on minimum balance requirements for each tier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Tier</TableHead>
                    <TableHead className="text-right text-gray-300">15 Days</TableHead>
                    <TableHead className="text-right text-gray-300">30 Days</TableHead>
                    <TableHead className="text-right text-gray-300">60 Days</TableHead>
                    <TableHead className="text-right text-gray-300">90 Days</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tierSettings.filter(t => t.balanceThreshold > 0 && !t.locked).map((tier) => (
                    <TableRow key={`earnings-${tier.id}`} className="border-border/40">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <tier.Icon className="h-5 w-5" />
                          <span className={cn("text-white", tier.className)}>{tier.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 15).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 30).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 60).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-green-400">
                        ${calculateEarnings(tier.balanceThreshold, tier.dailyProfit, 90).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-4 bg-green-500/10 border border-green-400/20 rounded-lg backdrop-blur-xl">
              <div className="flex gap-3">
                <Activity className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-300">Quantum Profit Analysis</p>
                  <p className="text-sm text-green-200">
                    These projections demonstrate the exponential growth potential of higher tier investments. Actual results may vary based on market conditions and neural network performance.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentTab === "ranks" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-400" />
              Hyperdrive Achievement Ranks
            </CardTitle>
            <CardDescription>
              Prestigious ranks representing significant milestones in your trading journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-300">Rank</TableHead>
                    <TableHead className="text-right text-gray-300">Balance Requirement</TableHead>
                    <TableHead className="text-right text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranks.map((rankItem) => {
                    const RankIconComponent = rankIcons[rankItem.Icon] || Brain;
                    const isAchieved = totalBalance >= rankItem.minBalance;
                    const isLocked = rankItem.name === 'Astral' || rankItem.name === 'Cosmic';
                    
                    return (
                      <TableRow key={rankItem.name} className="border-border/40">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <RankIconComponent className="h-5 w-5" />
                            <span className={cn("text-white", rankItem.className)}>{rankItem.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-gray-300">
                          ${rankItem.minBalance.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {isLocked ? (
                            <Badge variant="outline" className="border-red-400/40 text-red-300 bg-red-400/10">
                              <Lock className="mr-1 h-3 w-3"/>
                              Locked
                            </Badge>
                          ) : isAchieved ? (
                            <Badge variant="outline" className="border-green-400/40 text-green-300 bg-green-400/10">
                              <Star className="mr-1 h-3 w-3" />
                              Achieved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-blue-400/40 text-blue-300 bg-blue-400/10">
                              <Target className="mr-1 h-3 w-3" />
                              Available
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg backdrop-blur-xl">
              <div className="flex gap-3">
                <Crown className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-purple-300">Hyperdrive Honor System</p>
                  <p className="text-sm text-purple-200">
                    Each rank represents a badge of honor in your quantum trading journey. Higher ranks unlock exclusive features and demonstrate your mastery of the AstralCore hyperdrive.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border-yellow-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-200 italic">
                <strong>Quantum Disclaimer:</strong> All neural trading involves risk. Earnings projections are estimates based on current hyperdrive data. Past performance does not guarantee future results. Please engage the quantum protocols responsibly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
