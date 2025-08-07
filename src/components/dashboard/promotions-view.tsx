"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getPromotions, type Promotion } from "@/lib/promotions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Gift, 
  Star,
  User,
  ShieldCheck,
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
  ExternalLink,
  Zap
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
    Gift,
};

// Featured promotions data
const featuredPromotions = [
  {
    id: 'promo_1',
    title: 'Welcome Hyperdrive Bonus',
    description: 'Get 100% bonus on your first deposit up to $1000',
    reward: '$1000',
    type: 'bonus',
    status: 'active',
    image_url: 'https://cdn.dribbble.com/userupload/20812023/file/original-f847da681530f812dd38e256eff7bfc9.png?resize=1024x768&vertical=center',
    expires_at: '2024-12-31',
    claimed: false
  },
  {
    id: 'promo_2', 
    title: 'Neural Network Rewards',
    description: 'Earn 50 USDT for referring 5 active traders',
    reward: '$50',
    type: 'referral',
    status: 'active',
    image_url: 'https://cdn.dribbble.com/userupload/42761901/file/original-be28570edb00fadcbd4adb574a8aac5d.png?resize=1024x768&vertical=center',
    expires_at: '2024-12-31',
    claimed: false
  },
  {
    id: 'promo_3',
    title: 'Quantum Trading Contest',
    description: 'Top 10 traders win prizes up to $5000',
    reward: '$5000',
    type: 'contest',
    status: 'active', 
    image_url: 'https://cdn.dribbble.com/userupload/16578759/file/original-22d4b6fd5cf661342470f433ea9e9656.png?resize=1024x1024&vertical=center',
    expires_at: '2024-12-31',
    claimed: false
  }
];

export function PromotionsView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [currentTab, setCurrentTab] = React.useState<"active" | "featured" | "history">("active");

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
    async function fetchData() {
      const data = await getPromotions();
      setPromotions(data.filter(p => p.status !== 'Expired'));
    }
    fetchData();
  }, []);

  const handleClaimPromotion = async (promoId: string) => {
    try {
      // Simulate API call
      console.log(`Claiming promotion: ${promoId}`);
      
      toast({
        title: "Promotion Claimed!",
        description: "Your reward has been added to your account balance.",
      });
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Failed to claim promotion. Please try again.",
        variant: "destructive"
      });
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
  const RankIcon = rankIcons[rank.Icon] || Gift;
  const activePromotions = [...promotions, ...featuredPromotions].filter(p => p.status === 'active');
  const claimedPromotions = featuredPromotions.filter(p => p.claimed);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Promotions Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-pink-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500/30 to-purple-500/20 text-pink-400 font-bold text-lg backdrop-blur-xl">
                    <Gift className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    AstralCore Promotions
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Exclusive offers and rewards for hyperdrive members</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-pink-400/40 text-pink-300 bg-pink-400/10">
                    <Sparkles className="h-3 w-3 mr-1" />
                    VIP Access
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setCurrentTab(currentTab === "featured" ? "active" : "featured")}
                className="flex-1 sm:flex-none"
              >
                <Star className="h-4 w-4 mr-2" />
                Featured
              </Button>
              <Button
                size="sm"
                asChild
                className="flex-1 sm:flex-none bg-gradient-to-r from-pink-500 to-purple-600"
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
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-pink-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-pink-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500/20 to-pink-600/10 p-2 rounded-lg border border-pink-400/30">
                <Gift className="h-5 w-5 mx-auto text-pink-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-pink-400">{activePromotions.length}</p>
            <p className="text-xs text-gray-400">Active</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <CheckCircle className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{claimedPromotions.length}</p>
            <p className="text-xs text-gray-400">Claimed</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-yellow-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 p-2 rounded-lg border border-yellow-400/30">
                <TrendingUp className="h-5 w-5 mx-auto text-yellow-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-yellow-400">$5000</p>
            <p className="text-xs text-gray-400">Max Reward</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-green-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-green-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500/20 to-green-600/10 p-2 rounded-lg border border-green-400/30">
                <Clock className="h-5 w-5 mx-auto text-green-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-green-400">30d</p>
            <p className="text-xs text-gray-400">Valid</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("active")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "active"
              ? "bg-gradient-to-r from-pink-500/20 to-purple-500/10 border border-pink-400/40 text-pink-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Gift className="h-4 w-4 inline mr-2" />
          Active
        </button>
        <button
          onClick={() => setCurrentTab("featured")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "featured"
              ? "bg-gradient-to-r from-purple-500/20 to-blue-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Star className="h-4 w-4 inline mr-2" />
          Featured
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
      {currentTab === "active" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {activePromotions.map((promo) => (
            <Card key={promo.id} className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-pink-400/40 transition-all duration-300 group overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={promo.image_url || '/placeholder-promotion.jpg'}
                  alt={promo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs",
                      promo.type === 'bonus' && "border-green-400/40 text-green-300 bg-green-400/10",
                      promo.type === 'referral' && "border-blue-400/40 text-blue-300 bg-blue-400/10",
                      promo.type === 'contest' && "border-purple-400/40 text-purple-300 bg-purple-400/10"
                    )}
                  >
                    {promo.type}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-lg font-bold text-white mb-1">{promo.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{promo.description}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold text-yellow-400">{promo.reward}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>Expires {format(new Date(promo.expires_at), 'MMM dd')}</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleClaimPromotion(promo.id)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  disabled={promo.claimed}
                >
                  {promo.claimed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Claimed
                    </>
                  ) : (
                    <>
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Reward
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
          
          {activePromotions.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-lg font-medium text-white mb-2">No Active Promotions</h3>
              <p className="text-gray-400">Check back soon for exciting new offers and rewards!</p>
            </div>
          )}
        </div>
      )}

      {currentTab === "featured" && (
        <div className="space-y-4">
          {/* Special Offer Banner */}
          <Card className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-xl border-pink-400/40 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">Special Welcome Offer</h2>
                  <p className="text-gray-300 mb-4">
                    Join AstralCore today and get exclusive access to our hyperdrive trading system with a 100% deposit bonus!
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-400/40">Limited Time</Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/40">New Members Only</Badge>
                    <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/40">Up to $1000</Badge>
                  </div>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
                <div className="relative">
                  <div className="w-48 h-48 rounded-lg overflow-hidden">
                    <img
                      src="https://cdn.dribbble.com/userupload/20812023/file/original-f847da681530f812dd38e256eff7bfc9.png?resize=1024x768&vertical=center"
                      alt="Welcome Offer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Promotions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredPromotions.slice(1).map((promo) => (
              <Card key={promo.id} className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={promo.image_url}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{promo.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{promo.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-yellow-400">{promo.reward}</span>
                        <Button size="sm" variant="outline" className="border-border/40">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentTab === "history" && (
        <Card className="bg-black/40 backdrop-blur-xl border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <History className="h-5 w-5 text-green-400" />
              Promotion History
            </CardTitle>
            <CardDescription>
              Track your claimed promotions and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claimedPromotions.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-400/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="font-medium text-white text-sm">{promo.title}</p>
                      <p className="text-xs text-gray-400">{promo.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-400 text-sm">{promo.reward}</div>
                    <div className="text-xs text-gray-400">Claimed</div>
                  </div>
                </div>
              ))}
              
              {claimedPromotions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="font-medium">No claimed promotions yet</p>
                  <p className="text-sm">Start claiming rewards to build your history!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notice */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border-blue-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-200">
                <strong>Promotion Terms:</strong> All promotions are subject to terms and conditions. Rewards are credited within 24 hours of qualification. Some promotions may require verification or minimum trading volume.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
