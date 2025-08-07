"use client";

import * as React from "react";
import { 
  Users, 
  UserCheck, 
  Lock, 
  Crown, 
  Star, 
  TrendingUp, 
  Award,
  Shield,
  UserPlus,
  MessageSquare,
  Trophy,
  Target,
  Brain,
  Zap,
  User
} from "lucide-react";
import type { SVGProps } from 'react';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { useUser } from "@/contexts/UserContext";
import { getUserRank } from "@/lib/ranks";
import { cn } from "@/lib/utils";
import Link from "next/link";

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

type SquadMember = {
    id: string;
    username: string;
    rank: { name: string; Icon: string; className: string };
    tier: { name: string; Icon: string; className: string };
    earnings: number;
    joinedAt: string;
    avatarUrl?: string;
    isOnline: boolean;
    level: number;
};

const mockSquadMembers: SquadMember[] = [
  {
    id: "1",
    username: "CyberNinja",
    rank: { name: "Gold", Icon: "GoldRankIcon", className: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40" },
    tier: { name: "Elite", Icon: "tier-3", className: "bg-purple-500/20 text-purple-300 border-purple-400/40" },
    earnings: 2450.50,
    joinedAt: "2024-01-15",
    isOnline: true,
    level: 15
  },
  {
    id: "2", 
    username: "QuantumTrader",
    rank: { name: "Silver", Icon: "SilverRankIcon", className: "bg-gray-500/20 text-gray-300 border-gray-400/40" },
    tier: { name: "Advanced", Icon: "tier-2", className: "bg-blue-500/20 text-blue-300 border-blue-400/40" },
    earnings: 1875.25,
    joinedAt: "2024-02-01",
    isOnline: false,
    level: 12
  },
  {
    id: "3",
    username: "NeuralBot",
    rank: { name: "Bronze", Icon: "BronzeRankIcon", className: "bg-orange-500/20 text-orange-300 border-orange-400/40" },
    tier: { name: "Basic", Icon: "tier-1", className: "bg-green-500/20 text-green-300 border-green-400/40" },
    earnings: 945.75,
    joinedAt: "2024-02-15",
    isOnline: true,
    level: 8
  }
];

export function SquadView() {
  const { toast } = useToast();
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [squadMembers, setSquadMembers] = React.useState<SquadMember[]>(mockSquadMembers);
  const [activeTab, setActiveTab] = React.useState("overview");

  const { user } = useUser();

  React.useEffect(() => {
    if (user?.id) {
      getOrCreateWallet(user.id).then((walletData) => {
        setWallet(walletData);
        setIsLoading(false);
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
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
  const RankIcon = rankIcons[rank.Icon] || Lock;

  const totalMembers = squadMembers.length;
  const totalEarnings = squadMembers.reduce((sum, member) => sum + member.earnings, 0);
  const averageLevel = Math.floor(squadMembers.reduce((sum, member) => sum + member.level, 0) / totalMembers);
  const onlineMembers = squadMembers.filter(member => member.isOnline).length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Profile-style Header */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-purple-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-blue-500/20 text-purple-400 font-bold text-lg backdrop-blur-xl">
                    {wallet?.profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-400" />
                    Squad Command
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Manage your AstralCore squad and team performance
                </p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Squad Leader
                  </Badge>
                  <Badge variant="outline" className="text-xs border-purple-400/40 text-purple-300 bg-purple-400/10">
                    <Crown className="h-3 w-3 mr-1" />
                    Commander
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-400/40 text-green-300 bg-green-400/10">
                    <Users className="h-3 w-3 mr-1" />
                    {totalMembers} Members
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button
                size="sm"
                asChild
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-500 to-blue-600"
              >
                <Link href="/dashboard/squad/chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <TrendingUp className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Total Earnings</p>
            <p className="text-xs text-green-400">${totalEarnings.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Users className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Active Members</p>
            <p className="text-xs text-blue-400">{onlineMembers}/{totalMembers}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Brain className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Avg Level</p>
            <p className="text-xs text-purple-400">{averageLevel}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <Trophy className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-xs font-medium text-white">Squad Rank</p>
            <p className="text-xs text-yellow-400">#12</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-0">
          <div className="flex border-b border-border/40">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "overview"
                  ? "text-purple-400 bg-purple-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                Squad Overview
              </div>
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "members"
                  ? "text-blue-400 bg-blue-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <UserCheck className="h-4 w-4" />
                Members
              </div>
              {activeTab === "members" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={cn(
                "flex-1 px-4 py-3 text-sm font-medium transition-colors relative",
                activeTab === "performance"
                  ? "text-green-400 bg-green-500/10"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Target className="h-4 w-4" />
                Performance
              </div>
              {activeTab === "performance" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"></div>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Squad Command Center</h3>
                  <p className="text-sm text-gray-400">
                    Monitor your team's performance and coordinate strategies
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-400" />
                        Squad Achievements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Elite Squad Status</span>
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/40">
                          <Crown className="h-3 w-3 mr-1" />
                          Achieved
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Monthly Target</span>
                        <Badge className="bg-green-500/20 text-green-300 border-green-400/40">
                          <Target className="h-3 w-3 mr-1" />
                          85% Complete
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Hyperdrive Sync</span>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/40">
                          <Brain className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-white flex items-center gap-2">
                        <Zap className="h-4 w-4 text-blue-400" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-gray-400 space-y-2">
                        <div className="flex items-center justify-between">
                          <span>CyberNinja joined squad chat</span>
                          <span className="text-blue-400">2m ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>QuantumTrader completed trade</span>
                          <span className="text-green-400">15m ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>NeuralBot earned $45.50</span>
                          <span className="text-purple-400">1h ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Squad Members</h3>
                  <p className="text-sm text-gray-400">
                    Your team of AstralCore operators and their performance metrics
                  </p>
                </div>

                <div className="space-y-4">
                  {squadMembers.map((member) => {
                    const RankIcon = rankIcons[member.rank.Icon] || RecruitRankIcon;
                    return (
                      <Card key={member.id} className="bg-black/20 backdrop-blur-xl border-border/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-purple-400/40">
                                <AvatarImage src={member.avatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-purple-500/30 to-blue-500/20 text-purple-400 font-bold">
                                  {member.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {member.isOnline && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"></div>
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-white">{member.username}</h4>
                                <Badge className={cn("text-xs", member.rank.className)}>
                                  <RankIcon className="h-3 w-3 mr-1" />
                                  {member.rank.name}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>Level {member.level}</span>
                                <span>•</span>
                                <span>${member.earnings.toLocaleString()} earned</span>
                                <span>•</span>
                                <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <User className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Squad Performance Analytics</h3>
                  <p className="text-sm text-gray-400">
                    Track your squad's trading performance and hyperdrive metrics
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">
                        ${totalEarnings.toLocaleString()}
                      </div>
                      <p className="text-sm text-gray-400">Total Squad Earnings</p>
                      <div className="text-xs text-green-400 mt-1">+12.5% this month</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {averageLevel}
                      </div>
                      <p className="text-sm text-gray-400">Average Level</p>
                      <div className="text-xs text-blue-400 mt-1">+2.1 this week</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">
                        94%
                      </div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <div className="text-xs text-purple-400 mt-1">Above average</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-black/20 backdrop-blur-xl border-border/20">
                  <CardHeader>
                    <CardTitle className="text-sm text-white">Performance Leaderboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {squadMembers
                        .sort((a, b) => b.earnings - a.earnings)
                        .map((member, index) => (
                          <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                                index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                                index === 1 ? "bg-gray-500/20 text-gray-400" :
                                index === 2 ? "bg-orange-500/20 text-orange-400" :
                                "bg-blue-500/20 text-blue-400"
                              )}>
                                {index + 1}
                              </div>
                              <span className="text-white font-medium">{member.username}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-green-400">
                                ${member.earnings.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-400">
                                Level {member.level}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
