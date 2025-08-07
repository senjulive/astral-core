"use client";

import * as React from "react";
import { getOrCreateWallet, type WalletData } from "@/lib/wallet";
import { getNotifications, type Notification } from "@/lib/notifications";
import { getAnnouncements, type Announcement } from "@/lib/announcements";
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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { getUserRank } from "@/lib/ranks";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Inbox, 
  Mail,
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
  Trash2,
  Loader2,
  AlertCircle,
  MessageSquare,
  Bell,
  Megaphone,
  Gift
} from "lucide-react";
import { format, formatDistanceToNow } from 'date-fns';
import Image from "next/image";

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
    Mail,
};

export function InboxView() {
  const [wallet, setWallet] = React.useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);
  const [isClearing, setIsClearing] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<"notifications" | "announcements" | "promotions">("notifications");

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

  const fetchAllData = React.useCallback(async () => {
    if (user?.id) {
      const [notifs, anncs, promos] = await Promise.all([
        getNotifications(user.id),
        getAnnouncements(),
        getPromotions(),
      ]);
      setNotifications(notifs);
      setAnnouncements(anncs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setPromotions(promos.filter(p => p.status !== 'Expired'));
    }
  }, [user]);

  React.useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleClearInbox = async () => {
    setIsClearing(true);
    try {
      const response = await fetch('/api/notifications/clear', { method: 'POST' });
      if (!response.ok) throw new Error("Failed to clear inbox.");
      
      await fetchAllData();
      toast({ title: "Neural Inbox Cleared", description: "All personal notifications have been purged from the system." });
    } catch (error: any) {
      toast({ title: "Neural Network Error", description: error.message, variant: "destructive" });
    } finally {
      setIsClearing(false);
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
  const RankIcon = rankIcons[rank.Icon] || Mail;
  const unreadCount = notifications.filter(n => !n.read).length;
  const totalMessages = notifications.length + announcements.length + promotions.length;

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Inbox Header - Mobile Optimized */}
      <Card className="bg-black/40 backdrop-blur-xl border-border/40">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-400/30 rounded-full blur-lg animate-neural-pulse"></div>
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 relative border-2 border-indigo-400/40 backdrop-blur-xl">
                  <AvatarImage
                    src={wallet?.profile?.avatarUrl}
                    alt={wallet?.profile?.username || 'User'}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500/30 to-purple-500/20 text-indigo-400 font-bold text-lg backdrop-blur-xl">
                    <Inbox className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white">
                    Neural Communication Hub
                  </h1>
                </div>
                <p className="text-sm text-gray-400 mb-3">Central command for all AstralCore transmissions</p>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge className={cn("flex items-center gap-1 text-xs", rank.className)}>
                    <RankIcon className="h-3 w-3" />
                    Hyperdrive {rank.name}
                  </Badge>
                  {unreadCount > 0 && (
                    <Badge variant="outline" className="text-xs border-indigo-400/40 text-indigo-300 bg-indigo-400/10">
                      <Bell className="h-3 w-3 mr-1" />
                      {unreadCount} Unread
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading || notifications.length === 0 || isClearing}
                    className="flex-1 sm:flex-none"
                  >
                    {isClearing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-border/40">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Clear Neural Inbox?</AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-300">
                      This will permanently delete all personal notifications from your neural communication hub. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-border/40">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleClearInbox} 
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                size="sm"
                className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-purple-600"
                onClick={() => setCurrentTab("notifications")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Mobile Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-indigo-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-indigo-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 p-2 rounded-lg border border-indigo-400/30">
                <Mail className="h-5 w-5 mx-auto text-indigo-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-indigo-400">{totalMessages}</p>
            <p className="text-xs text-gray-400">Total</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-blue-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-2 rounded-lg border border-blue-400/30">
                <Bell className="h-5 w-5 mx-auto text-blue-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-blue-400">{unreadCount}</p>
            <p className="text-xs text-gray-400">Unread</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-purple-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-2 rounded-lg border border-purple-400/30">
                <Megaphone className="h-5 w-5 mx-auto text-purple-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-purple-400">{announcements.length}</p>
            <p className="text-xs text-gray-400">Announcements</p>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-pink-400/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-pink-400/20 rounded-lg blur-sm group-hover:animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500/20 to-pink-600/10 p-2 rounded-lg border border-pink-400/30">
                <Gift className="h-5 w-5 mx-auto text-pink-400" />
              </div>
            </div>
            <p className="text-lg font-bold text-pink-400">{promotions.length}</p>
            <p className="text-xs text-gray-400">Promotions</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-black/20 backdrop-blur-xl rounded-lg border border-border/40">
        <button
          onClick={() => setCurrentTab("notifications")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "notifications"
              ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/10 border border-indigo-400/40 text-indigo-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Bell className="h-4 w-4 inline mr-2" />
          Notifications
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-indigo-500/20 text-indigo-300 border-indigo-400/40 text-xs px-1 py-0">
              {unreadCount}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setCurrentTab("announcements")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "announcements"
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border border-purple-400/40 text-purple-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Megaphone className="h-4 w-4 inline mr-2" />
          Announcements
        </button>
        <button
          onClick={() => setCurrentTab("promotions")}
          className={cn(
            "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
            currentTab === "promotions"
              ? "bg-gradient-to-r from-pink-500/20 to-red-500/10 border border-pink-400/40 text-pink-400"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          <Gift className="h-4 w-4 inline mr-2" />
          Promotions
        </button>
      </div>

      {/* Tab Content */}
      {currentTab === "notifications" && (
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card key={notification.id} className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-indigo-400/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2"></div>
                      )}
                      {notification.read && (
                        <div className="w-2 h-2 bg-gray-600 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{notification.title}</h3>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(notification.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">{notification.content}</p>
                      {notification.href && (
                        <Button size="sm" variant="outline" asChild className="border-border/40">
                          <Link href={notification.href}>
                            <MessageSquare className="h-3 w-3 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-8">
                <div className="text-center">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No Notifications</h3>
                  <p className="text-gray-400">Neural transmissions will appear here when available.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentTab === "announcements" && (
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-purple-400/40 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0">
                      <Megaphone className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white text-sm">{announcement.title}</h3>
                        <span className="text-xs text-gray-400">
                          {format(new Date(announcement.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{announcement.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-black/40 backdrop-blur-xl border-border/40">
              <CardContent className="p-8">
                <div className="text-center">
                  <Megaphone className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-lg font-medium text-white mb-2">No Announcements</h3>
                  <p className="text-gray-400">System announcements will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentTab === "promotions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promotions.length > 0 ? (
            promotions.map((promotion) => (
              <Card key={promotion.id} className="bg-black/40 backdrop-blur-xl border-border/40 hover:border-pink-400/40 transition-all duration-300 overflow-hidden">
                {promotion.image_url && (
                  <div className="aspect-video relative overflow-hidden">
                    <Image 
                      src={promotion.image_url} 
                      alt={promotion.title} 
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">{promotion.title}</h3>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "text-xs",
                        promotion.status === 'Active' && "border-green-400/40 text-green-300 bg-green-400/10",
                        promotion.status === 'Upcoming' && "border-blue-400/40 text-blue-300 bg-blue-400/10"
                      )}
                    >
                      {promotion.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300">{promotion.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2">
              <Card className="bg-black/40 backdrop-blur-xl border-border/40">
                <CardContent className="p-8">
                  <div className="text-center">
                    <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400 opacity-50" />
                    <h3 className="text-lg font-medium text-white mb-2">No Active Promotions</h3>
                    <p className="text-gray-400">Special offers and promotions will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* System Status */}
      <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border-indigo-400/20">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <MessageSquare className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-indigo-200">
                <strong>Neural Communication Status:</strong> All transmission channels are operational. Messages are delivered instantly across the AstralCore network. System uptime: 99.9%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
