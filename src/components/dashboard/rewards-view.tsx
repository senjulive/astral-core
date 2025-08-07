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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Gift, 
  Star, 
  Crown, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Coins,
  User,
  ShieldCheck,
  Calendar,
  Brain,
  Target,
  Award,
  Flame,
  CreditCard,
  History,
  Plus
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
    Crown,
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ElementType;
  category: "trading" | "referral" | "milestone" | "special";
  requirement: {
    type: "balance" | "referrals" | "trades" | "days" | "deposits";
    target: number;
    current?: number;
  };
  claimed: boolean;
};

type DailyReward = {
  day: number;
  reward: number;
  claimed: boolean;
  type: "USDT" | "bonus";
};

const achievements: Achievement[] = [
  {
    id: "first_deposit",
    title: "Neural Activation",
    description: "Make your first deposit to activate AstralCore systems",
    reward: 5,
    icon: Coins,
    category: "milestone",
    requirement: { type: "deposits", target: 1, current: 0 },
    claimed: false
  },
  {
    id: "balance_100",
    title: "Quantum Initiate", 
    description: "Reach $100 total balance in the hyperdrive",
    reward: 10,
    icon: Trophy,
    category: "trading",
    requirement: { type: "balance", target: 100, current: 0 },
    claimed: false
  },
  {
    id: "balance_500",
    title: "Neural Commander",
    description: "Achieve $500 total balance mastery", 
    reward: 25,
    icon: Crown,
    category: "trading",
    requirement: { type: "balance", target: 500, current: 0 },
    claimed: false
  },
  {
    id: "balance_1000",
    title: "Hyperdrive Master",
    description: "Reach $1,000 quantum wealth threshold",
    reward: 50,
    icon: Star,
    category: "trading", 
    requirement: { type: "balance", target: 1000, current: 0 },
    claimed: false
  },
  {
    id: "referral_5",
    title: "Squad Architect",
    description: "Build your neural network with 5 members",
    reward: 20,
    icon: Users,
    category: "referral",
    requirement: { type: "referrals", target: 5, current: 0 },
    claimed: false
  },
  {
    id: "referral_10", 
    title: "Network Overlord",
    description: "Expand your influence to 10 squad members",
    reward: 50,
    icon: Crown,
    category: "referral",
    requirement: { type: "referrals", target: 10, current: 0 },
    claimed: false
  },
  {
    id: "trading_streak",
    title: "Quantum Consistency",
    description: "Maintain trading activity for 7 consecutive days",
    reward: 15,
    icon: TrendingUp,
    category: "trading",
    requirement: { type: "days", target: 7, current: 0 },
    claimed: false
  },
  {
    id: "early_adopter",
    title: "AstralCore Pioneer",
    description: "Special recognition for joining the quantum revolution",
    reward: 100,
    icon: Zap,
    category: "special",
    requirement: { type: "days", target: 1, current: 1 },
    claimed: false
  }
];

const dailyRewards: DailyReward[] = Array.from({ length: 7 }, (_, i) => ({
  day: i + 1,
  reward: i === 6 ? 10 : [1, 1.5, 2, 2.5, 3, 5][i],
  claimed: i < 3, // Mock: first 3 days claimed
  type: i === 6 ? "bonus" : "USDT"
}));

export function RewardsView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userAchievements, setUserAchievements] = React.useState<Achievement[]>(achievements);
  const [dailyStreak, setDailyStreak] = React.useState(3);
  const [lastClaimDate, setLastClaimDate] = React.useState<Date>(new Date());
  const [currentTab, setCurrentTab] = React.useState<"achievements" | "daily" | "history">("achievements");

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

  // Update achievements with current user data
  React.useEffect(() => {
    if (wallet) {
      const totalBalance = wallet.balances?.usdt || 0;
      const referralCount = wallet.squad?.members?.length || 0;
      const depositCount = wallet.deposit_history?.length || 0;

      setUserAchievements(prev => prev.map(achievement => {
        let current = 0;
        switch (achievement.requirement.type) {
          case "balance":
            current = totalBalance;
            break;
          case "referrals":
            current = referralCount;
            break;
          case "deposits":
            current = depositCount;
            break;
          case "days":
          case "trades":
            current = achievement.requirement.current || 0;
            break;
        }

        return {
          ...achievement,
          requirement: { ...achievement.requirement, current },
          claimed: wallet.claimed_achievements?.achievements?.includes(achievement.id) || false
        };
      }));
    }
  }, [wallet]);

  const availableRewards = userAchievements.filter(a => 
    a.requirement.current >= a.requirement.target && !a.claimed
  );

  const claimableRewardsValue = availableRewards.reduce((sum, reward) => sum + reward.reward, 0);

  const handleClaimAchievement = async (achievementId: string) => {
    try {
      const achievement = userAchievements.find(a => a.id === achievementId);
      if (!achievement || achievement.claimed) return;

      setUserAchievements(prev => 
        prev.map(a => 
          a.id === achievementId ? { ...a, claimed: true } : a
        )
      );

      toast({
        title: "Quantum Reward Acquired!",
        description: `You earned $${achievement.reward} USDT for "${achievement.title}"`,
      });
    } catch (error) {
      toast({
        title: "Neural Network Error",
        description: "Failed to claim reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClaimDailyReward = async () => {
    try {
      const today = new Date();
      const lastClaim = lastClaimDate;
      const hoursSinceLastClaim = (today.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

      if (hoursSinceLastClaim < 20) {
        toast({
          title: "Quantum Cooldown Active",
          description: "Your next daily reward will be available in a few hours.",
          variant: "destructive"
        });
        return;
      }

      const nextDay = dailyStreak + 1;
      const reward = dailyRewards[Math.min(nextDay - 1, 6)];

      setDailyStreak(prev => Math.min(prev + 1, 7));
      setLastClaimDate(today);

      toast({
        title: "Daily Quantum Boost Claimed!",
        description: `You earned $${reward.reward} USDT! Day ${nextDay} streak activated.`,
      });
    } catch (error) {
      toast({
        title: "Hyperdrive Error", 
        description: "Failed to claim daily reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    const { current = 0, target } = achievement.requirement;
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case "trading": return "border-blue-400/40 text-blue-300 bg-blue-400/10";
      case "referral": return "border-green-400/40 text-green-300 bg-green-400/10";
      case "milestone": return "border-yellow-400/40 text-yellow-300 bg-yellow-400/10";
      case "special": return "border-purple-400/40 text-purple-300 bg-purple-400/10";
      default: return "border-gray-400/40 text-gray-300 bg-gray-400/10";
    }
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
  const RankIcon = rankIcons[rank.Icon] || Crown;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Rewards Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-purple-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-gold-500/20 text-purple-400 font-bold text-lg backdrop-blur-xl">
                    <Trophy className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Quantum Rewards Center
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Claim achievements and daily quantum boosts</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-300 bg-purple-400/10">
                    <Flame className="h-3 w-3 mr-1" />
                    {dailyStreak} Day Streak
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "daily" ? "achievements" : "daily")}
                className="flex-1 sm:flex-none"
              >
                <Flame className="h-4 w-4 mr-2" />
                Daily
              </Button>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-gold-600"
                disabled={availableRewards.length === 0}
                onClick={() => availableRewards.forEach(a => handleClaimAchievement(a.id))}
              >
                <Gift className="h-4 w-4 mr-2" />
                Claim All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Trophy className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">${claimableRewardsValue}</p>
            <p className="text-xs text-gray-400">Claimable</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">{userAchievements.filter(a => a.claimed).length}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Flame className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{dailyStreak}</p>
            <p className="text-xs text-gray-400">Day Streak</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Target className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-yellow-400">{availableRewards.length}</p>
            <p className="text-xs text-gray-400">Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("achievements")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "achievements"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Award className="h-4 w-4 inline mr-2" />
          Achievements
        </button>
        <button
          onClick={() => setCurrentTab("daily")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "daily"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Flame className="h-4 w-4 inline mr-2" />
          Daily
        </button>
        <button
          onClick={() => setCurrentTab("history")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "history"
              ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-400/40 text-green-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <History className="h-4 w-4 inline mr-2" />
          History
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === "achievements" && (
        <div className="space-y-4">
          {/* Available Rewards Alert */}
          {availableRewards.length > 0 && (
            <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-xl border-green-400/40">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Gift className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-400">Quantum Rewards Ready!</h3>
                    <p className="text-sm text-gray-300">
                      {availableRewards.length} achievement{availableRewards.length !== 1 ? 's' : ''} completed - ${claimableRewardsValue} USDT waiting
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                    onClick={() => availableRewards.forEach(a => handleClaimAchievement(a.id))}
                  >
                    Claim All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {userAchievements.map((achievement) => {
              const progress = getProgressPercentage(achievement);
              const isCompleted = achievement.requirement.current >= achievement.requirement.target;
              const canClaim = isCompleted && !achievement.claimed;

              return (
                <Card key={achievement.id} className={cn(
                  "bg-black/40 backdrop-blur-xl border-border/40 relative overflow-hidden",
                  achievement.claimed && "opacity-75",
                  canClaim && "border-green-400/40 hover:border-green-400/60"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        achievement.claimed ? "bg-gray-500/10" : "bg-purple-500/10"
                      )}>
                        <achievement.icon className={cn(
                          "h-5 w-5",
                          achievement.claimed ? "text-gray-500" : "text-purple-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white text-sm">{achievement.title}</h3>
                          {achievement.claimed && <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={cn("text-xs", getCategoryColor(achievement.category))}>
                            {achievement.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gold-400/40 text-gold-300 bg-gold-400/10">
                            ${achievement.reward} USDT
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{achievement.requirement.current}/{achievement.requirement.target}</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                    
                    <div className="mt-3">
                      {canClaim ? (
                        <Button 
                          onClick={() => handleClaimAchievement(achievement.id)}
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Gift className="h-3 w-3 mr-2" />
                          Claim ${achievement.reward}
                        </Button>
                      ) : achievement.claimed ? (
                        <Button variant="outline" disabled size="sm" className="w-full">
                          <CheckCircle className="h-3 w-3 mr-2" />
                          Claimed
                        </Button>
                      ) : (
                        <Button variant="outline" disabled size="sm" className="w-full">
                          <Clock className="h-3 w-3 mr-2" />
                          {progress > 0 ? `${Math.round(progress)}% Complete` : 'Locked'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {currentTab === "daily" && (
        <div className="space-y-4">
          {/* Daily Streak Status */}
          <Card className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-400" />
                Daily Quantum Streak: {dailyStreak} days
              </CardTitle>
              <CardDescription>
                Maintain your daily login streak to unlock increasing rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {dailyRewards.map((reward) => {
                  const isToday = reward.day === dailyStreak + 1;
                  const isPast = reward.day <= dailyStreak;
                  const isFuture = reward.day > dailyStreak + 1;

                  return (
                    <div
                      key={reward.day}
                      className={cn(
                        "text-center p-2 sm:p-3 border rounded-lg backdrop-blur-xl",
                        isPast && "bg-green-500/10 border-green-400/40",
                        isToday && "bg-blue-500/10 border-blue-400/40",
                        isFuture && "bg-gray-500/10 border-gray-400/20"
                      )}
                    >
                      <div className="text-xs font-bold mb-1">Day {reward.day}</div>
                      <div className="text-lg mb-1">
                        {reward.day === 7 ? "🎁" : "💰"}
                      </div>
                      <div className="text-xs font-medium text-white">
                        ${reward.reward}
                      </div>
                      {isPast && (
                        <Badge variant="default" className="mt-1 text-xs bg-green-500/20 text-green-400">
                          ✓
                        </Badge>
                      )}
                      {isToday && (
                        <Badge variant="default" className="mt-1 text-xs bg-blue-500/20 text-blue-400">
                          Now
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>

              {dailyStreak < 7 && (
                <div className="mt-4 text-center">
                  <Button onClick={handleClaimDailyReward} className="bg-gradient-to-r from-orange-500 to-red-600">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Today's Quantum Boost
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Daily Rewards Info */}
          <Card className="bg-black/40 backdrop-blur-xl border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Quantum Boost Protocol</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Daily Access</p>
                    <p className="text-xs text-gray-400">Connect to the neural grid daily to maintain your streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Escalating Rewards</p>
                    <p className="text-xs text-gray-400">Quantum boosts increase each consecutive day</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gold-500/10 rounded-lg">
                    <Gift className="h-4 w-4 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Weekly Bonus</p>
                    <p className="text-xs text-gray-400">Day 7 unlocks a special hyperdrive bonus</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentTab === "history" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="h-5 w-5 text-green-400" />
              Quantum Reward History
            </CardTitle>
            <CardDescription>
              Track your claimed achievements and earnings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userAchievements
                .filter(a => a.claimed)
                .map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-400/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <achievement.icon className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white text-sm">{achievement.title}</p>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400 text-sm">+${achievement.reward} USDT</div>
                      <div className="text-xs text-gray-400">Claimed</div>
                    </div>
                  </div>
                ))}
              
              {userAchievements.filter(a => a.claimed).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No rewards claimed yet</p>
                  <p className="text-sm">Complete achievements to start earning quantum rewards!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
