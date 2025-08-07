
"use client";

import * as React from "react";
import { format } from "date-fns";
import { Send, Loader2, Users, Crown, Bot } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { Badge } from "../ui/badge";
import { type Rank } from "@/lib/ranks";
import type { TierSetting as TierData } from "@/lib/tiers";
import { tierIcons, tierClassNames } from "@/lib/settings";

import { RecruitRankIcon } from '@/components/icons/ranks/recruit-rank-icon';
import { BronzeRankIcon } from '@/components/icons/ranks/bronze-rank-icon';
import { SilverRankIcon } from '@/components/icons/ranks/silver-rank-icon';
import { GoldRankIcon } from '@/components/icons/ranks/gold-rank-icon';
import { PlatinumRankIcon } from '@/components/icons/ranks/platinum-rank-icon';
import { DiamondRankIcon } from '@/components/icons/ranks/diamond-rank-icon';
import { AstralLogo } from "../icons/astral-logo";

const rankIcons: Record<string, React.ElementType> = {
    RecruitRankIcon, BronzeRankIcon, SilverRankIcon, GoldRankIcon, PlatinumRankIcon, DiamondRankIcon,
};

type ChatMessage = {
    id: string;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    text: string;
    timestamp: number;
    rank: Rank;
    tier: TierData | null;
    isAdmin?: boolean;
};

type Leader = {
    id: string;
    displayName: string;
    squadSize: number;
    color: string;
};

const LeaderboardItem = ({ displayName, squadSize, color }: Leader) => (
    <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50">
        <span className="flex items-center gap-2 font-medium">
            <Crown className={cn("h-4 w-4", color)} />
            {displayName}
        </span>
        <span className="text-xs text-muted-foreground">{squadSize.toLocaleString()} members</span>
    </div>
);

const initialLeaders: Omit<Leader, 'squadSize' | 'id'>[] = [
    { displayName: "CryptoKing", color: "text-amber-400" },
    { displayName: "SatoshiN", color: "text-amber-400" },
    { displayName: "EtherEve", color: "text-slate-400" },
    { displayName: "TheWhale", color: "text-slate-400" },
    { displayName: "NewbieTrader", color: "text-sky-400" },
];

export function PublicChatView({ isFloating = false }: { isFloating?: boolean }) {
  const { toast } = useToast();
  const { user, wallet, rank, tier } = useUser();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const [onlineUsers, setOnlineUsers] = React.useState(0);
  const [leaders, setLeaders] = React.useState<Leader[]>([]);
  
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const fetchHistory = React.useCallback(async () => {
    if (user?.id) {
        try {
            const response = await fetch('/api/chat/public');
            if (!response.ok) throw new Error("Failed to fetch messages.");
            const history = await response.json();
            setMessages(history);
        } catch (error: any) {
            if(!isFloating) toast({ title: "Error", description: error.message, variant: "destructive" });
        }
        setIsLoading(false);
    }
  }, [user, toast, isFloating]);

  React.useEffect(() => {
    setIsLoading(true);
    fetchHistory();
    
    setOnlineUsers(Math.floor(Math.random() * (10000 - 3000 + 1)) + 3000);
    const onlineInterval = setInterval(() => {
        setOnlineUsers(prev => Math.max(3000, Math.min(10000, prev + Math.floor(Math.random() * 201) - 100)));
    }, 5000);

    const messageInterval = setInterval(() => {
        fetchHistory();
    }, 5000);

    // Initialize leaders
    setLeaders(initialLeaders.map((l, i) => ({
        ...l,
        id: `leader-${i}`,
        squadSize: Math.floor(Math.random() * (200 - 30 + 1)) + 30
    })));

    const leaderInterval = setInterval(() => {
        setLeaders(prevLeaders => prevLeaders.map(l => ({
            ...l,
            squadSize: l.squadSize + Math.floor(Math.random() * 3)
        })).sort((a,b) => b.squadSize - a.squadSize));
    }, 3000);


    return () => {
        clearInterval(onlineInterval);
        clearInterval(messageInterval);
        clearInterval(leaderInterval);
    };
  }, [fetchHistory]);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !wallet) return;

    if (!wallet.profile?.displayName && !wallet.profile?.username) {
        toast({ title: "Display Name Required", description: "Please set a display name in your profile before chatting.", variant: "destructive"});
        return;
    }

    setIsSending(true);
    
    try {
      await fetch('/api/chat/public', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              userId: user.id,
              text: newMessage,
              rank,
              tier
          })
      });

      setNewMessage("");
      await fetchHistory();
    } catch (error: any) {
      toast({
        title: "Error Sending Message",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const CardComponent = isFloating ? 'div' : Card;

  return (
    <div className={cn("grid gap-6", !isFloating && "lg:grid-cols-3")}>
        {!isFloating && (
             <Card>
                <CardHeader>
                    <CardTitle>Community Leaders</CardTitle>
                    <CardDescription>Top squad builders in the community.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                    {leaders.map(leader => (
                        <LeaderboardItem key={leader.id} {...leader} />
                    ))}
                </CardContent>
            </Card>
        )}
        <CardComponent className={cn("h-full flex flex-col", !isFloating && "lg:col-span-2")}>
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Public Chat</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        {onlineUsers.toLocaleString()} active users
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full pr-4" viewportRef={scrollAreaRef}>
                {isLoading ? (
                    <div className="space-y-4">
                    <Skeleton className="h-16 w-3/4" /><Skeleton className="h-16 w-3/4 ml-auto" /><Skeleton className="h-16 w-3/4" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center"><p className="text-muted-foreground">Be the first to say something!</p></div>
                ) : (
                    <div className="space-y-6">
                    {messages.map((message) => {
                        const isOwnMessage = message.userId === user?.id;
                        const RankIcon = message.rank ? rankIcons[message.rank.Icon] : null;
                        const TierIcon = message.tier ? tierIcons[message.tier.id] : null;
                        const tierClassName = message.tier ? tierClassNames[message.tier.id] : null;

                        return (
                        <div key={message.id} className={cn("flex items-start gap-3", isOwnMessage && "justify-end")}>
                            {!isOwnMessage && (
                                message.isAdmin ? (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"><AstralLogo className="h-8 w-8"/></div>
                                ) : (
                                    <Avatar className="h-10 w-10"><AvatarImage src={message.avatarUrl} /><AvatarFallback>{message.displayName.charAt(0)}</AvatarFallback></Avatar>
                                )
                            )}
                            <div className={cn("flex flex-col space-y-1 max-w-xs sm:max-w-md", isOwnMessage && "items-end")}>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">{message.isAdmin ? "AstralCore" : message.displayName}</span>
                                    {RankIcon && message.rank && <Badge variant="outline" className={cn("h-5 px-1.5", message.rank.className)}><RankIcon className="h-3 w-3" /></Badge>}
                                    {TierIcon && tierClassName && <Badge variant="outline" className={cn("h-5 px-1.5", tierClassName)}><TierIcon className="h-3 w-3" /></Badge>}
                                </div>
                                <div className={cn("rounded-lg px-4 py-2 text-sm", isOwnMessage ? "bg-primary text-primary-foreground" : message.isAdmin ? "bg-card text-foreground border" : "bg-muted")}>
                                    {message.text}
                                </div>
                                <span className="text-xs text-muted-foreground">{format(new Date(message.timestamp), "h:mm a")}</span>
                            </div>
                            {isOwnMessage && (
                                <Avatar className="h-10 w-10"><AvatarImage src={wallet?.profile.avatarUrl} /><AvatarFallback>{(wallet?.profile.displayName || wallet?.profile.username || 'U').charAt(0)}</AvatarFallback></Avatar>
                            )}
                        </div>
                        )
                    })}
                    </div>
                )}
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." disabled={isSending || isLoading} />
                <Button type="submit" disabled={isSending || isLoading || !newMessage.trim()}><Send className="h-4 w-4" /></Button>
                </form>
            </CardFooter>
        </CardComponent>
    </div>
  );
}
