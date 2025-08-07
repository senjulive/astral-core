
"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Trash2,
  Loader2,
  MicOff,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import type { Rank } from "@/lib/ranks";
import type { TierSetting as TierData } from "@/lib/tiers";
import { tierIcons, tierClassNames } from "@/lib/settings";

import { RecruitRankIcon } from "@/components/icons/ranks/recruit-rank-icon";
import { BronzeRankIcon } from "@/components/icons/ranks/bronze-rank-icon";
import { SilverRankIcon } from "@/components/icons/ranks/silver-rank-icon";
import { GoldRankIcon } from "@/components/icons/ranks/gold-rank-icon";
import { PlatinumRankIcon } from "@/components/icons/ranks/platinum-rank-icon";
import { DiamondRankIcon } from "@/components/icons/ranks/diamond-rank-icon";
import { AstralLogo } from "../icons/astral-logo";
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

const rankIcons: Record<string, React.ElementType> = {
  RecruitRankIcon,
  BronzeRankIcon,
  SilverRankIcon,
  GoldRankIcon,
  PlatinumRankIcon,
  DiamondRankIcon,
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

export function PublicChatManager() {
  const { toast } = useToast();
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const fetchHistory = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/public");
      if (!response.ok) throw new Error("Failed to fetch messages.");
      const history = await response.json();
      setMessages(history.sort((a: ChatMessage, b: ChatMessage) => a.timestamp - b.timestamp));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast]);

  React.useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDeleteMessage = async (messageId: string) => {
    setIsDeleting(messageId);
    try {
      const response = await fetch('/api/admin/chat/public', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messageId }),
      });
      const result = await response.json();
      if (!response.ok) {
          throw new Error(result.error || "Failed to delete message.");
      }
      toast({ title: "Message Deleted", description: "The message has been removed from the public chat." });
      fetchHistory(); // Refresh the chat log
    } catch (error: any) {
      toast({
        title: "Error Deleting Message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Public Chat Management</CardTitle>
          <CardDescription>
            Oversee and moderate the community chat.
          </CardDescription>
        </div>
        <Button onClick={fetchHistory} variant="outline" size="icon" disabled={isLoading}>
            <RefreshCw className={isLoading ? "animate-spin" : ""} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" viewportRef={scrollAreaRef}>
          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4 ml-auto" />
                <Skeleton className="h-16 w-3/4" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Chat is empty.</p>
              </div>
            ) : (
              messages.map((message) => {
                const RankIcon = rankIcons[message.rank.Icon];
                const TierIcon = message.tier ? tierIcons[message.tier.id] : null;
                const tierClassName = message.tier ? tierClassNames[message.tier.id] : null;

                return (
                  <div key={message.id} className="flex items-start gap-3 group">
                    {message.isAdmin ? (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <AstralLogo className="h-8 w-8" />
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={message.avatarUrl} />
                        <AvatarFallback>
                          {message.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex flex-col space-y-1 w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                            {message.isAdmin ? "AstralCore" : message.displayName}
                            </span>
                            {RankIcon && (
                            <Badge variant="outline" className={cn("h-5 px-1.5", message.rank.className)}>
                                <RankIcon className="h-3 w-3" />
                            </Badge>
                            )}
                            {TierIcon && tierClassName && (
                            <Badge variant="outline" className={cn("h-5 px-1.5", tierClassName)}>
                                <TierIcon className="h-3 w-3" />
                            </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{format(new Date(message.timestamp), "PPp")}</span>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-7 w-7" disabled={!!isDeleting}>
                                        {isDeleting === message.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete this message?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone. The message will be permanently removed.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMessage(message.id)}>Delete</AlertDialogAction></AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => toast({title: "Feature Coming Soon"})}>
                                <MicOff className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      <div className="rounded-md p-2 text-sm bg-muted/50 border">
                        {message.text}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
