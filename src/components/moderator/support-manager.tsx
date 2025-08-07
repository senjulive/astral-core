'use client';

import * as React from 'react';
import {format} from 'date-fns';
import {
  sendAdminMessage,
  type ChatHistory,
  type Message,
} from '@/lib/chat-client';
import {Skeleton} from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {BrainCircuit, Loader2, Send, Hand} from 'lucide-react';
import {cn} from '@/lib/utils';
import {useToast} from '@/hooks/use-toast';
import {type SupportAgentOutput} from '@/ai/flows/support-agent-flow';
import {Card, CardContent} from '@/components/ui/card';
import {type WalletData} from '@/lib/wallet';
import {useUser} from '@/contexts/UserContext';
import {logModeratorAction} from '@/lib/moderator';

type MappedWallet = WalletData & {user_id: string};
type ClaimStatus = {
  user_id: string;
  handler_id: string;
  handler: {username: string};
};

export function SupportManager() {
  const [chats, setChats] = React.useState<ChatHistory | null>(null);
  const [wallets, setWallets] = React.useState<Record<string, MappedWallet> | null>(
    null
  );
  const [claimStatus, setClaimStatus] = React.useState<
    Record<string, ClaimStatus>
  >({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [replyMessages, setReplyMessages] = React.useState<
    Record<string, string>
  >({});
  const [isSending, setIsSending] = React.useState<Record<string, boolean>>({});
  const [analysis, setAnalysis] = React.useState<
    Record<string, SupportAgentOutput | null>
  >({});
  const [isAnalyzing, setIsAnalyzing] = React.useState<Record<string, boolean>>(
    {}
  );
  const [isClaiming, setIsClaiming] = React.useState<Record<string, boolean>>({});
  const {toast} = useToast();
  const {user} = useUser();

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);

    const fetchWallets = async (): Promise<Record<string, MappedWallet>> => {
      try {
        const response = await fetch('/api/admin/wallets', {method: 'POST'});
        if (!response.ok) return {};
        return await response.json();
      } catch {
        return {};
      }
    };

    const fetchClaims = async (): Promise<Record<string, ClaimStatus>> => {
      try {
        const response = await fetch('/api/support/claim');
        if (!response.ok) return {};
        return await response.json();
      } catch {
        return {};
      }
    };
    
    const fetchAllChats = async (): Promise<ChatHistory> => {
        try {
            const response = await fetch('/api/support/chat', { method: 'PATCH' });
            if (!response.ok) return {};
            return await response.json();
        } catch {
            return {};
        }
    };

    const [chatData, walletData, claimData] = await Promise.all([
      fetchAllChats(),
      fetchWallets(),
      fetchClaims(),
    ]);

    setChats(chatData);
    setWallets(walletData);
    setClaimStatus(claimData);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendMessage = async (userId: string, username: string) => {
    const text = replyMessages[userId];
    if (!text || !text.trim()) return;

    setIsSending(prev => ({...prev, [userId]: true}));

    await fetch('/api/support/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text, sender: 'admin' }),
    });

    await logModeratorAction(`Replied to support thread for user ${username}.`);

    await fetchData(); // Refetch all data

    setReplyMessages(prev => ({...prev, [userId]: ''}));
    setIsSending(prev => ({...prev, [userId]: false}));
  };

  const handleAnalyze = async (userId: string, messages: Message[]) => {
    setIsAnalyzing(prev => ({...prev, [userId]: true}));
    setAnalysis(prev => ({...prev, [userId]: null}));
    try {
      const response = await fetch('/api/support-agent', {
        method: 'POST',
        body: JSON.stringify({messages}),
      });
      if (!response.ok) throw new Error('Failed to get analysis.');
      const result: SupportAgentOutput = await response.json();
      setAnalysis(prev => ({...prev, [userId]: result}));
    } catch (e) {
      toast({title: 'AI Analysis Failed', variant: 'destructive'});
    } finally {
      setIsAnalyzing(prev => ({...prev, [userId]: false}));
    }
  };

  const handleClaim = async (supportUserId: string, action: 'claim' | 'unclaim') => {
    if (!user) return;
    setIsClaiming(prev => ({...prev, [supportUserId]: true}));
    try {
      const response = await fetch('/api/support/claim', {
        method: 'POST',
        body: JSON.stringify({supportUserId, action}),
      });
      if (!response.ok) throw new Error('Failed to update claim status.');
      const updatedClaim = await response.json();
      setClaimStatus(prev => ({...prev, [supportUserId]: updatedClaim}));
    } catch (e) {
      toast({title: 'Claim Failed', variant: 'destructive'});
    } finally {
      setIsClaiming(prev => ({...prev, [supportUserId]: false}));
    }
  };

  const sortedChats = chats
    ? Object.entries(chats).sort(([, a], [, b]) => {
        if (a.length === 0) return 1;
        if (b.length === 0) return -1;
        const lastMsgA = new Date(a[a.length - 1]?.timestamp ?? 0).getTime();
        const lastMsgB = new Date(b[b.length - 1]?.timestamp ?? 0).getTime();
        return lastMsgB - lastMsgA;
      })
    : [];

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  if (!chats || sortedChats.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No messages found.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {sortedChats.map(([userId, messages]) => {
        if (messages.length === 0) return null;
        const wallet = wallets?.[userId];
        const displayName = wallet?.profile?.username || userId;
        const currentClaim = claimStatus[userId];
        const isClaimedByOther =
          currentClaim?.handler_id && currentClaim?.handler_id !== user?.id;

        return (
          <AccordionItem value={userId} key={userId}>
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="font-medium">{displayName}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{userId}</p>
                    {currentClaim && (
                      <Badge variant="secondary" className="text-xs">
                        <Hand className="mr-1 h-3 w-3" />
                        {currentClaim.handler_id === user?.id
                          ? 'Claimed by you'
                          : `Claimed by ${currentClaim.handler.username}`}
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge
                  variant={
                    messages[messages.length - 1]?.sender === 'user'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className="mr-4"
                >
                  {messages[messages.length - 1]?.sender === 'user'
                    ? 'New'
                    : 'Viewed'}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalyze(userId, messages)}
                        disabled={isAnalyzing[userId] || isLoading}
                      >
                        {isAnalyzing[userId] ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <BrainCircuit className="mr-2 h-4 w-4" />
                        )}
                        Analyze
                      </Button>
                      {currentClaim?.handler_id === user?.id ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleClaim(userId, 'unclaim')}
                          disabled={isClaiming[userId]}
                        >
                          {isClaiming[userId] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Hand className="mr-2 h-4 w-4" />
                          )}
                          Unclaim
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClaim(userId, 'claim')}
                          disabled={isClaiming[userId] || isClaimedByOther}
                        >
                          {isClaiming[userId] ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Hand className="mr-2 h-4 w-4" />
                          )}
                          Claim Ticket
                        </Button>
                      )}
                    </div>

                    {isAnalyzing[userId] && (
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    )}
                    {analysis[userId] && (
                      <div className="space-y-3 animate-in fade-in-50">
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            AI Summary
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {analysis[userId]?.summary}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            Suggested Reply
                          </h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-background rounded-md border">
                            {analysis[userId]?.suggestedReply}
                          </p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="mt-2 px-2"
                            onClick={() =>
                              setReplyMessages(prev => ({
                                ...prev,
                                [userId]: analysis[userId]?.suggestedReply || '',
                              }))
                            }
                          >
                            Use this reply
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <ScrollArea className="h-64 w-full rounded-md border p-4">
                  <div className="space-y-4">
                    {messages.map(message => (
                      <div key={message.id} className="flex flex-col">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span className="font-bold">
                            {message.sender === 'user'
                              ? displayName
                              : 'AstralCore Support'}
                          </span>
                          <span>
                            {format(new Date(message.timestamp), 'PPp')}
                          </span>
                        </div>
                        <div
                          className={cn(
                            'rounded-md p-3 text-sm',
                            message.silent
                              ? 'bg-accent text-accent-foreground/80 italic'
                              : 'bg-muted/50'
                          )}
                        >
                          <p>{message.text}</p>
                          {message.file_url && (
                            <img
                              src={message.file_url}
                              alt="Attached file"
                              className="mt-2 rounded-md max-w-full h-auto"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage(userId, displayName);
                  }}
                  className="flex w-full items-center space-x-2 border-t pt-4"
                >
                  <Input
                    value={replyMessages[userId] || ''}
                    onChange={e =>
                      setReplyMessages(prev => ({
                        ...prev,
                        [userId]: e.target.value,
                      }))
                    }
                    placeholder="Type your reply..."
                    disabled={isSending[userId]}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSending[userId] || !replyMessages[userId]?.trim()}
                  >
                    {isSending[userId] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
