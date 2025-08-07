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
  Star,
  Crown,
  Shield,
  Brain,
  Target,
  Award,
  CreditCard,
  History,
  Plus,
  TrendingUp,
  Coins,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  Zap,
  Users,
  Flame,
  Diamond,
  Gem,
  Rocket,
  Medal,
  Flag
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
    Award,
};

// Achievement and Milestone Types
type AchievementType = "trading" | "referral" | "milestone" | "special" | "tier" | "rank";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  type: AchievementType;
  requirement: {
    type: "balance" | "referrals" | "trades" | "days" | "deposits" | "rank" | "tier";
    target: number;
    current?: number;
  };
  unlocked: boolean;
  progress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  reward?: string;
  unlockedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: "journey" | "mastery" | "social" | "wealth" | "prestige";
  stages: {
    level: number;
    target: number;
    reward: string;
    unlocked: boolean;
  }[];
  currentStage: number;
  totalStages: number;
  progress: number;
}

// Sample achievements data
const achievements: Achievement[] = [
  {
    id: "first_login",
    title: "Neural Awakening",
    description: "Welcome to the AstralCore hyperdrive system",
    icon: Brain,
    type: "milestone",
    requirement: { type: "days", target: 1, current: 1 },
    unlocked: true,
    progress: 100,
    rarity: "common",
    reward: "5 USDT",
    unlockedAt: new Date()
  },
  {
    id: "first_deposit",
    title: "Quantum Ignition",
    description: "Make your first deposit to fuel the hyperdrive",
    icon: Rocket,
    type: "milestone",
    requirement: { type: "deposits", target: 1, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "common",
    reward: "10 USDT"
  },
  {
    id: "balance_100",
    title: "Credit Centurion",
    description: "Achieve $100 total balance",
    icon: Coins,
    type: "trading",
    requirement: { type: "balance", target: 100, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "common",
    reward: "15 USDT"
  },
  {
    id: "balance_1000",
    title: "Hyperdrive Elite",
    description: "Reach $1,000 in total assets",
    icon: Star,
    type: "trading",
    requirement: { type: "balance", target: 1000, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "rare",
    reward: "50 USDT"
  },
  {
    id: "balance_10000",
    title: "Quantum Overlord",
    description: "Amass $10,000 in the neural vaults",
    icon: Crown,
    type: "trading",
    requirement: { type: "balance", target: 10000, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "epic",
    reward: "200 USDT"
  },
  {
    id: "referral_5",
    title: "Network Builder",
    description: "Recruit 5 members to your neural collective",
    icon: Users,
    type: "referral",
    requirement: { type: "referrals", target: 5, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "common",
    reward: "25 USDT"
  },
  {
    id: "referral_25",
    title: "Neural Commander",
    description: "Build a network of 25 active members",
    icon: Shield,
    type: "referral",
    requirement: { type: "referrals", target: 25, current: 0 },
    unlocked: false,
    progress: 0,
    rarity: "epic",
    reward: "150 USDT"
  },
  {
    id: "streak_30",
    title: "Consistency Master",
    description: "Login daily for 30 consecutive days",
    icon: Flame,
    type: "special",
    requirement: { type: "days", target: 30, current: 3 },
    unlocked: false,
    progress: 10,
    rarity: "rare",
    reward: "75 USDT"
  },
  {
    id: "diamond_rank",
    title: "Diamond Ascension",
    description: "Achieve the prestigious Diamond rank",
    icon: Diamond,
    type: "rank",
    requirement: { type: "rank", target: 6, current: 1 },
    unlocked: false,
    progress: 16.6,
    rarity: "legendary",
    reward: "500 USDT"
  }
];

// Sample milestones data
const milestones: Milestone[] = [
  {
    id: "trading_journey",
    title: "Hyperdrive Mastery",
    description: "Progress through trading excellence levels",
    icon: TrendingUp,
    category: "mastery",
    stages: [
      { level: 1, target: 100, reward: "10 USDT", unlocked: false },
      { level: 2, target: 500, reward: "25 USDT", unlocked: false },
      { level: 3, target: 1000, reward: "50 USDT", unlocked: false },
      { level: 4, target: 5000, reward: "150 USDT", unlocked: false },
      { level: 5, target: 10000, reward: "300 USDT", unlocked: false }
    ],
    currentStage: 0,
    totalStages: 5,
    progress: 0
  },
  {
    id: "wealth_accumulation",
    title: "Neural Wealth Matrix",
    description: "Build your quantum fortune milestone by milestone",
    icon: Gem,
    category: "wealth",
    stages: [
      { level: 1, target: 1000, reward: "Premium Badge", unlocked: false },
      { level: 2, target: 5000, reward: "Elite Status", unlocked: false },
      { level: 3, target: 25000, reward: "VIP Access", unlocked: false },
      { level: 4, target: 100000, reward: "Quantum Lord", unlocked: false },
      { level: 5, target: 500000, reward: "AstralCore Legend", unlocked: false }
    ],
    currentStage: 0,
    totalStages: 5,
    progress: 0
  },
  {
    id: "social_network",
    title: "Collective Expansion",
    description: "Grow your neural network influence",
    icon: Users,
    category: "social",
    stages: [
      { level: 1, target: 5, reward: "Recruiter Badge", unlocked: false },
      { level: 2, target: 15, reward: "Network Leader", unlocked: false },
      { level: 3, target: 50, reward: "Community Builder", unlocked: false },
      { level: 4, target: 100, reward: "Neural Architect", unlocked: false },
      { level: 5, target: 250, reward: "Collective Overlord", unlocked: false }
    ],
    currentStage: 0,
    totalStages: 5,
    progress: 0
  }
];

export function AchievementsView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userAchievements, setUserAchievements] = React.useState<Achievement[]>(achievements);
  const [userMilestones, setUserMilestones] = React.useState<Milestone[]>(milestones);
  const [currentTab, setCurrentTab] = React.useState<"achievements" | "milestones" | "badges">("achievements");

  const { user } = useUser();
  const { toast } = useToast();

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        updateProgressData(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  const updateProgressData = (walletData: WalletData) => {
    const totalBalance = walletData.balances?.usdt || 0;
    const referralCount = walletData.squad?.members?.length || 0;
    const depositCount = walletData.deposit_history?.length || 0;
    const rank = getUserRank(totalBalance);

    // Update achievements progress
    setUserAchievements(prev => prev.map(achievement => {
      let current = 0;
      let progress = 0;

      switch (achievement.requirement.type) {
        case "balance":
          current = totalBalance;
          progress = Math.min((current / achievement.requirement.target) * 100, 100);
          break;
        case "referrals":
          current = referralCount;
          progress = Math.min((current / achievement.requirement.target) * 100, 100);
          break;
        case "deposits":
          current = depositCount;
          progress = Math.min((current / achievement.requirement.target) * 100, 100);
          break;
        case "rank":
          current = rank.minBalance >= achievement.requirement.target ? 1 : 0;
          progress = current === 1 ? 100 : 0;
          break;
        default:
          current = achievement.requirement.current || 0;
          progress = achievement.progress;
      }

      const unlocked = progress >= 100;

      return {
        ...achievement,
        requirement: { ...achievement.requirement, current },
        progress,
        unlocked: unlocked || achievement.unlocked,
        unlockedAt: unlocked && !achievement.unlocked ? new Date() : achievement.unlockedAt
      };
    }));

    // Update milestones progress
    setUserMilestones(prev => prev.map(milestone => {
      let current = 0;
      
      switch (milestone.category) {
        case "mastery":
        case "wealth":
          current = totalBalance;
          break;
        case "social":
          current = referralCount;
          break;
        default:
          current = 0;
      }

      const updatedStages = milestone.stages.map(stage => ({
        ...stage,
        unlocked: current >= stage.target
      }));

      const currentStage = updatedStages.findIndex(stage => !stage.unlocked);
      const actualCurrentStage = currentStage === -1 ? milestone.totalStages : currentStage;
      
      let progress = 0;
      if (actualCurrentStage < milestone.totalStages) {
        const nextTarget = milestone.stages[actualCurrentStage].target;
        const prevTarget = actualCurrentStage > 0 ? milestone.stages[actualCurrentStage - 1].target : 0;
        progress = Math.min(((current - prevTarget) / (nextTarget - prevTarget)) * 100, 100);
      } else {
        progress = 100;
      }

      return {
        ...milestone,
        stages: updatedStages,
        currentStage: actualCurrentStage,
        progress
      };
    }));
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case "common": return "border-gray-400/40 text-gray-300";
      case "rare": return "border-blue-400/40 text-blue-300";
      case "epic": return "border-purple-400/40 text-purple-300";
      case "legendary": return "border-gold-400/40 text-gold-300";
      default: return "border-gray-400/40 text-gray-300";
    }
  };

  const getRarityBg = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case "common": return "bg-gray-400/10";
      case "rare": return "bg-blue-400/10";
      case "epic": return "bg-purple-400/10";
      case "legendary": return "bg-gold-400/10";
      default: return "bg-gray-400/10";
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
  const RankIcon = rankIcons[rank.Icon] || Award;
  const unlockedAchievements = userAchievements.filter(a => a.unlocked).length;
  const completedMilestones = userMilestones.reduce((acc, m) => acc + m.stages.filter(s => s.unlocked).length, 0);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Achievements Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gold-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-gold-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-gold-500/30 to-yellow-500/20 text-gold-400 font-bold text-lg backdrop-blur-xl">
                    <Trophy className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Achievement Matrix
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Track your progress through the AstralCore hyperdrive</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-gold-400/40 text-gold-300 bg-gold-400/10">
                    <Trophy className="h-3 w-3 mr-1" />
                    {unlockedAchievements} Unlocked
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "badges" ? "achievements" : "badges")}
                className="flex-1 sm:flex-none"
              >
                <Medal className="h-4 w-4 mr-2" />
                Badges
              </Button>
              <Button
                size="sm"
                asChild
                className="flex-1 sm:flex-none bg-gradient-to-r from-gold-500 to-yellow-600"
              >
                <Link href="/dashboard/rewards">
                  <Plus className="h-4 w-4 mr-2" />
                  Rewards
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-gold-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-gold-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-gold-500/20 to-gold-600/10 p-2 rounded-lg border border-gold-400/30">
                <Trophy className="h-5 w-5 mx-auto text-gold-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-gold-400">{unlockedAchievements}</p>
            <p className="text-xs text-gray-400">Achievements</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Flag className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">{completedMilestones}</p>
            <p className="text-xs text-gray-400">Milestones</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Target className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">
              {Math.round(userAchievements.reduce((acc, a) => acc + a.progress, 0) / userAchievements.length)}%
            </p>
            <p className="text-xs text-gray-400">Progress</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Sparkles className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">
              {userAchievements.filter(a => a.rarity === "legendary" && a.unlocked).length}
            </p>
            <p className="text-xs text-gray-400">Legendary</p>
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
              ? "bg-gradient-to-r from-gold-500/20 to-yellow-500/10 border border-gold-400/40 text-gold-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Trophy className="h-4 w-4 inline mr-2" />
          Achievements
        </button>
        <button
          onClick={() => setCurrentTab("milestones")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "milestones"
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-400/40 text-blue-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Flag className="h-4 w-4 inline mr-2" />
          Milestones
        </button>
        <button
          onClick={() => setCurrentTab("badges")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "badges"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Medal className="h-4 w-4 inline mr-2" />
          Badge Gallery
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === "achievements" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {userAchievements.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={cn(
                "bg-black/40 backdrop-blur-xl border-border/40 transition-all duration-300",
                achievement.unlocked ? "hover:border-gold-400/40" : "opacity-60 hover:opacity-80"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-3 rounded-lg flex-shrink-0 transition-all duration-300",
                    achievement.unlocked 
                      ? "bg-gradient-to-br from-gold-500/20 to-yellow-500/10 border border-gold-400/30" 
                      : "bg-gray-500/10 border border-gray-600/30"
                  )}>
                    <achievement.icon className={cn(
                      "h-6 w-6",
                      achievement.unlocked ? "text-gold-400" : "text-gray-500"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={cn(
                        "font-semibold text-sm",
                        achievement.unlocked ? "text-white" : "text-gray-400"
                      )}>
                        {achievement.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getRarityColor(achievement.rarity), getRarityBg(achievement.rarity))}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{achievement.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{achievement.requirement.current || 0}/{achievement.requirement.target}</span>
                      </div>
                      <Progress 
                        value={achievement.progress} 
                        className={cn(
                          "h-2",
                          achievement.unlocked ? "bg-gold-400/20" : "bg-gray-600/20"
                        )}
                      />
                    </div>
                    
                    {achievement.reward && (
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gold-400 font-medium">Reward: {achievement.reward}</span>
                        {achievement.unlocked ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    )}
                    
                    {achievement.unlockedAt && (
                      <p className="text-xs text-green-400 mt-2">
                        Unlocked {format(achievement.unlockedAt, 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentTab === "milestones" && (
        <div className="space-y-4">
          {userMilestones.map((milestone) => (
            <Card key={milestone.id} className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-lg border border-blue-400/30">
                    <milestone.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-1">{milestone.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{milestone.description}</p>
                    <Badge variant="outline" className="text-xs border-blue-400/40 text-blue-300 bg-blue-400/10">
                      {milestone.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      Stage {milestone.currentStage}/{milestone.totalStages}
                    </p>
                    <p className="text-xs text-gray-400">{Math.round(milestone.progress)}% Progress</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {milestone.stages.map((stage, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg border text-center transition-all duration-300",
                        stage.unlocked
                          ? "bg-green-500/10 border-green-400/40"
                          : index === milestone.currentStage
                          ? "bg-blue-500/10 border-blue-400/40"
                          : "bg-gray-500/10 border-gray-600/30"
                      )}
                    >
                      <div className="text-lg font-bold mb-1">
                        {index + 1}
                      </div>
                      <div className={cn(
                        "text-xs mb-2",
                        stage.unlocked ? "text-green-400" : index === milestone.currentStage ? "text-blue-400" : "text-gray-500"
                      )}>
                        {stage.target.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">{stage.reward}</div>
                      {stage.unlocked && (
                        <CheckCircle className="h-4 w-4 text-green-400 mx-auto mt-2" />
                      )}
                    </div>
                  ))}
                </div>
                
                {milestone.currentStage < milestone.totalStages && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Next Stage Progress</span>
                      <span>{Math.round(milestone.progress)}%</span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {currentTab === "badges" && (
        <div className="space-y-4">
          {/* Badge Collection Header */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-purple-400/40">
            <CardContent className="p-6">
              <div className="text-center">
                <Medal className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                <h2 className="text-2xl font-bold text-white mb-2">Badge Collection</h2>
                <p className="text-gray-300">
                  Showcase your achievements with these exclusive AstralCore badges
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userAchievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={cn(
                  "bg-black/40 backdrop-blur-xl border-border/40 transition-all duration-300 cursor-pointer group",
                  achievement.unlocked ? "hover:border-gold-400/40" : "opacity-40"
                )}
              >
                <CardContent className="p-4 text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300",
                    achievement.unlocked 
                      ? "bg-gradient-to-br from-gold-500/20 to-yellow-500/10 border-2 border-gold-400/40 group-hover:scale-110" 
                      : "bg-gray-500/10 border-2 border-gray-600/30 grayscale"
                  )}>
                    <achievement.icon className={cn(
                      "h-8 w-8",
                      achievement.unlocked ? "text-gold-400" : "text-gray-500"
                    )} />
                  </div>
                  <h4 className={cn(
                    "font-medium text-xs mb-1",
                    achievement.unlocked ? "text-white" : "text-gray-500"
                  )}>
                    {achievement.title}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      achievement.unlocked ? getRarityColor(achievement.rarity) : "border-gray-600/40 text-gray-500",
                      achievement.unlocked ? getRarityBg(achievement.rarity) : "bg-gray-500/10"
                    )}
                  >
                    {achievement.rarity}
                  </Badge>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-400 mt-2">
                      {format(achievement.unlockedAt, 'MMM dd')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-gold-500/10 to-yellow-500/10 backdrop-blur-xl border-gold-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Sparkles className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gold-200">
                <strong>Achievement Progress:</strong> You've unlocked {unlockedAchievements} out of {userAchievements.length} achievements and completed {completedMilestones} milestone stages. Keep pushing the boundaries of the AstralCore hyperdrive!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
